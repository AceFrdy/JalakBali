import { WEEKLY_RELEASES, CURRENT_RELEASE, AVAILABILITY_CALENDAR_SLOTS } from "@/data/weeklyReleases";
import { WeeklyRelease, AvailabilitySlot } from "@/types";

export async function getWeeklyReleases(): Promise<WeeklyRelease[]> {
  return WEEKLY_RELEASES;
}

export async function getCurrentRelease(): Promise<WeeklyRelease> {
  return CURRENT_RELEASE;
}

export async function getReleaseById(id: string): Promise<WeeklyRelease | null> {
  return WEEKLY_RELEASES.find((r) => r.id === id || r.week.toLowerCase() === id.toLowerCase()) || null;
}

export async function getAvailabilityCalendar(): Promise<AvailabilitySlot[]> {
  return AVAILABILITY_CALENDAR_SLOTS;
}

export function getActiveUpcomingRelease(releases: WeeklyRelease[]): WeeklyRelease | undefined {
  if (!releases || releases.length === 0) return undefined;

  const nowStr = new Date().toISOString().slice(0, 10);

  // 1. Prioritas 1: Rilis berstatus "open" dan belum lewat
  const activeOpen = releases.find((r) => r.status === "open" && (!r.isPast && (!r.releaseDate || r.releaseDate >= nowStr)));
  if (activeOpen) return activeOpen;

  // 2. Prioritas 2: Rilis terjadwal (scheduled) berikutnya di masa depan
  const upcomingScheduled = releases.find((r) => r.status === "scheduled" && (!r.isPast && (!r.releaseDate || r.releaseDate >= nowStr)));
  if (upcomingScheduled) return upcomingScheduled;

  // 3. Fallback: Rilis terbuka pertama atau rilis pertama di daftar
  return releases.find((r) => r.status === "open") || releases[0];
}
