const ANIMALS = [
  "Lion",
  "Eagle",
  "Flame",
  "River",
  "Star",
  "Ember",
  "Comet",
  "Cheetah",
  "Mountain",
  "Thunder",
  "Dawn",
  "Spark",
] as const;

export function generateAnonHandle(seed = Math.random()): string {
  const animal = ANIMALS[Math.floor(seed * ANIMALS.length) % ANIMALS.length] ?? "Lion";
  const num = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `Kathu ${animal} ${num}`;
}
