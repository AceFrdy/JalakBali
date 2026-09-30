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
