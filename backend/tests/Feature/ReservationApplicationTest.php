<?php

namespace Tests\Feature;

use App\Models\ReservationApplication;
use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReservationApplicationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CatalogSeeder::class);
    }

    public function test_customer_can_submit_an_application_with_a_private_identity_document(): void
    {
        Storage::fake('local');

        $response = $this->post('/api/reservations', [
            'reservation_type' => 'individual',
            'weekly_release_id' => 'release-2026-w40',
            'bird_id' => 'bird-jb-001',
            'customer_name' => 'Alfred',
            'customer_email' => 'alfred@example.com',
            'customer_phone' => '081234567890',
            'city' => 'Denpasar',
            'payment_type' => 'deposit',
            'payment_method' => 'qris',
            'deposit_amount' => 2500000,
            'identity_document' => UploadedFile::fake()->create('ktp.pdf', 500, 'application/pdf'),
        ]);

        $response->assertCreated()->assertJsonStructure([
            'id',
            'bookingCode',
            'accessToken',
            'applicationStatus',
            'documentVerificationStatus',
            'paymentStatus',
        ]);
        $application = ReservationApplication::query()->firstOrFail();
        $document = $application->documents()->firstOrFail();

        $this->assertSame('submitted', $application->application_status);
        $this->assertSame(32500000, $application->price);
        $this->assertSame('identity', $document->document_type);
        Storage::disk('local')->assertExists($document->path);

        $this->getJson('/api/reservations/'.$response->json('bookingCode').'?token='.$response->json('accessToken'))
            ->assertOk()
            ->assertJsonPath('applicationStatus', 'submitted')
            ->assertJsonPath('price', 32500000);
    }

    public function test_oversized_identity_documents_are_rejected(): void
    {
        Storage::fake('local');

        $response = $this->post('/api/reservations', [
            'reservation_type' => 'individual',
            'weekly_release_id' => 'release-2026-w40',
            'customer_name' => 'Alfred',
            'customer_email' => 'alfred@example.com',
            'customer_phone' => '081234567890',
            'payment_type' => 'deposit',
            'payment_method' => 'qris',
            'identity_document' => UploadedFile::fake()->create('ktp.pdf', 10241, 'application/pdf'),
        ]);

        $response->assertSessionHasErrors('identity_document');
        $this->assertDatabaseCount('reservation_applications', 0);
    }

    public function test_customer_can_upload_manual_payment_proof_with_the_application_token(): void
    {
        Storage::fake('local');

        $created = $this->post('/api/reservations', [
            'reservation_type' => 'individual',
            'weekly_release_id' => 'release-2026-w40',
            'bird_id' => 'bird-jb-001',
            'customer_name' => 'Alfred',
            'customer_email' => 'alfred@example.com',
            'customer_phone' => '081234567890',
            'payment_type' => 'deposit',
            'payment_method' => 'bank_transfer',
            'identity_document' => UploadedFile::fake()->create('ktp.pdf', 500, 'application/pdf'),
        ]);

        $application = ReservationApplication::query()->firstOrFail();
        $response = $this->post('/api/reservations/'.$application->booking_code.'/payment-proof', [
            'access_token' => $created->json('accessToken'),
            'payment_proof' => UploadedFile::fake()->create('payment-proof.jpg', 100, 'image/jpeg'),
        ]);

        $response->assertOk()->assertJsonPath('paymentStatus', 'processing');
        $this->assertDatabaseHas('reservation_documents', [
            'reservation_application_id' => $application->id,
            'document_type' => 'payment_proof',
        ]);
        Storage::disk('local')->assertExists(
            $application->documents()->where('document_type', 'payment_proof')->firstOrFail()->path,
        );
    }

    public function test_signed_payment_webhook_is_idempotent(): void
    {
        $created = $this->post('/api/reservations', [
            'reservation_type' => 'individual',
            'weekly_release_id' => 'release-2026-w40',
            'bird_id' => 'bird-jb-001',
            'customer_name' => 'Alfred',
            'customer_email' => 'alfred@example.com',
            'customer_phone' => '081234567890',
            'payment_type' => 'deposit',
            'payment_method' => 'qris',
            'identity_document' => UploadedFile::fake()->create('ktp.pdf', 500, 'application/pdf'),
        ]);
        $application = ReservationApplication::query()->firstOrFail();
        config(['services.payment_webhook_secret' => 'test-webhook-secret']);
        $payload = json_encode([
            'event_id' => 'evt-001',
            'booking_code' => $application->booking_code,
            'external_id' => 'payment-001',
            'status' => 'paid',
            'amount' => 5000000,
        ], JSON_THROW_ON_ERROR);
        $signature = hash_hmac('sha256', $payload, 'test-webhook-secret');

        $response = $this->call('POST', '/api/payments/webhook/midtrans', [], [], [], [
            'HTTP_X_WEBHOOK_SIGNATURE' => $signature,
            'CONTENT_TYPE' => 'application/json',
        ], $payload);

        $response->assertOk()->assertJsonPath('accepted', true);
        $this->assertDatabaseHas('payments', ['external_id' => 'payment-001', 'status' => 'paid']);
        $this->assertDatabaseHas('payment_transactions', [
            'provider_transaction_id' => 'payment-001',
            'status' => 'paid',
            'type' => 'payment',
            'amount' => 5000000,
        ]);
        $this->assertDatabaseHas('reservation_applications', [
            'id' => $application->id,
            'payment_status' => 'paid',
        ]);
        $this->assertDatabaseHas('audit_logs', ['action' => 'payment.webhook.paid']);

        $this->call('POST', '/api/payments/webhook/midtrans', [], [], [], [
            'HTTP_X_WEBHOOK_SIGNATURE' => $signature,
            'CONTENT_TYPE' => 'application/json',
        ], $payload)->assertJsonPath('duplicate', true);

        $application->update(['application_status' => 'cancelled']);
        $this->assertDatabaseHas('audit_logs', [
            'entity_type' => ReservationApplication::class,
            'entity_id' => (string) $application->id,
            'action' => 'application.updated',
        ]);
        $this->assertDatabaseHas('payment_transactions', [
            'provider_transaction_id' => 'payment-001',
            'status' => 'paid',
        ]);
    }

    public function test_partial_refund_creates_a_separate_historical_transaction(): void
    {
        $this->post('/api/reservations', [
            'reservation_type' => 'individual',
            'weekly_release_id' => 'release-2026-w40',
            'bird_id' => 'bird-jb-001',
            'customer_name' => 'Alfred',
            'customer_email' => 'alfred@example.com',
            'customer_phone' => '081234567890',
            'payment_type' => 'deposit',
            'payment_method' => 'qris',
            'identity_document' => UploadedFile::fake()->create('ktp.pdf', 500, 'application/pdf'),
        ]);
        $application = ReservationApplication::query()->firstOrFail();
        config(['services.payment_webhook_secret' => 'test-webhook-secret']);
        $payload = json_encode([
            'event_id' => 'evt-refund-001',
            'booking_code' => $application->booking_code,
            'external_id' => 'payment-refund-001',
            'type' => 'partial_refund',
            'status' => 'refunded',
            'amount' => 1000000,
        ], JSON_THROW_ON_ERROR);

        $this->call('POST', '/api/payments/webhook/midtrans', [], [], [], [
            'HTTP_X_WEBHOOK_SIGNATURE' => hash_hmac('sha256', $payload, 'test-webhook-secret'),
            'CONTENT_TYPE' => 'application/json',
        ], $payload)->assertOk();

        $this->assertDatabaseHas('payment_transactions', [
            'provider_transaction_id' => 'payment-refund-001',
            'type' => 'partial_refund',
            'status' => 'refunded',
            'amount' => 1000000,
        ]);
        $this->assertSame(2, $application->paymentTransactions()->count());
    }

    public function test_review_is_pending_until_admin_approves_it(): void
    {
        Storage::fake('local');

        $created = $this->post('/api/reservations', [
            'reservation_type' => 'individual',
            'weekly_release_id' => 'release-2026-w40',
            'bird_id' => 'bird-jb-001',
            'customer_name' => 'Alfred',
            'customer_email' => 'alfred@example.com',
            'customer_phone' => '081234567890',
            'payment_type' => 'deposit',
            'payment_method' => 'qris',
            'identity_document' => UploadedFile::fake()->create('ktp.pdf', 500, 'application/pdf'),
        ]);
        $application = ReservationApplication::query()->firstOrFail();
        $application->update(['application_status' => 'completed']);

        $review = $this->post('/api/reviews', [
            'booking_code' => $application->booking_code,
            'access_token' => $created->json('accessToken'),
            'body' => 'Proses reservasi jelas dan pendampingannya sangat membantu.',
            'rating' => 5,
            'media' => [UploadedFile::fake()->create('aviary.jpg', 100, 'image/jpeg')],
        ]);

        $review->assertCreated()->assertJsonPath('status', 'pending');
        $this->getJson('/api/reviews')->assertOk()->assertJsonCount(0);

        $application->reviews()->firstOrFail()->update(['status' => 'approved']);
        $this->getJson('/api/reviews')->assertOk()->assertJsonCount(1);
    }
}
