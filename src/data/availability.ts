import { AVAILABILITY_CALENDAR_SLOTS, CURRENT_RELEASE, WEEKLY_RELEASES } from "./weeklyReleases";
import { AvailabilitySlot } from "@/types";

export const AVAILABILITY_SCHEDULE: AvailabilitySlot[] = AVAILABILITY_CALENDAR_SLOTS;

export const NEXT_AVAILABLE_SLOT: AvailabilitySlot =
  AVAILABILITY_CALENDAR_SLOTS.find((s) => s.status === "available") ||
  AVAILABILITY_CALENDAR_SLOTS[2];

export { CURRENT_RELEASE, WEEKLY_RELEASES };
