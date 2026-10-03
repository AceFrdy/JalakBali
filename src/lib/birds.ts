import { BIRDS_COLLECTION, BREEDING_PAIRS } from "@/data/birds";
import { Bird, BreedingPair } from "@/types";

export async function getAllBirds(): Promise<Bird[]> {
  // Simulating async backend API call
  return BIRDS_COLLECTION;
}

export async function getBirdById(id: string): Promise<Bird | null> {
  const searchId = id.toLowerCase();
  const bird =
    BIRDS_COLLECTION.find(
      (b) =>
        b.id.toLowerCase() === searchId ||
        b.tagging.toLowerCase() === searchId ||
        (b.publicId && b.publicId.toLowerCase() === searchId)
    ) || null;
  return bird;
}

export async function getAvailableBirds(): Promise<Bird[]> {
  return BIRDS_COLLECTION.filter((b) => b.status === "available");
}

export async function getAllBreedingPairs(): Promise<BreedingPair[]> {
  return BREEDING_PAIRS;
}

export async function getBreedingPairById(id: string): Promise<BreedingPair | null> {
  const pair =
    BREEDING_PAIRS.find((p) => p.id === id || p.pairId.toLowerCase() === id.toLowerCase()) ||
    null;
  return pair;
}
