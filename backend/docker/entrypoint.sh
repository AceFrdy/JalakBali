#!/bin/bash
set -e

echo "========================================="
echo " Jalak Bali Backend - Startup Script"
echo "========================================="

# Fix storage & cache permissions (penting karena volume mount override chown di build time)
echo "[1/6] Fixing storage permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Create storage:link (public disk symlink)
echo "[2/6] Creating storage symlink..."
php artisan storage:link --force 2>/dev/null || true

# Run database migrations
echo "[3/6] Running database migrations..."
php artisan migrate --force

# Clear & cache config/routes/views for production
echo "[4/6] Caching config, routes, and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize application
echo "[5/6] Optimizing application..."
php artisan optimize

echo "[6/6] Starting services via supervisord..."
echo "========================================="
echo " Startup complete!"
echo "========================================="

# Start supervisord (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
