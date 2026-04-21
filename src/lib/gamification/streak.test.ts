import { describe, it, expect } from "vitest";
import { nextStreak, flameTier, flameEmoji } from "./streak";

describe("nextStreak", () => {
  it("starts at 1 with no prior completion", () => {
    expect(nextStreak(0, null, "2024-01-15")).toBe(1);
  });

  it("increments streak on consecutive days", () => {
    expect(nextStreak(3, "2024-01-14", "2024-01-15")).toBe(4);
  });

  it("resets to 1 after a gap of more than 1 day", () => {
    expect(nextStreak(5, "2024-01-12", "2024-01-15")).toBe(1);
  });

  it("does not change streak when completed same day", () => {
    expect(nextStreak(3, "2024-01-15", "2024-01-15")).toBe(3);
  });

  it("keeps at least 1 when same-day repeat with streak of 0", () => {
    expect(nextStreak(0, "2024-01-15", "2024-01-15")).toBe(1);
  });

  it("resets correctly after exactly 2 day gap", () => {
    expect(nextStreak(7, "2024-01-13", "2024-01-15")).toBe(1);
  });

  it("handles month boundary continuation", () => {
    expect(nextStreak(10, "2024-01-31", "2024-02-01")).toBe(11);
  });

  it("handles year boundary continuation", () => {
    expect(nextStreak(20, "2023-12-31", "2024-01-01")).toBe(21);
  });
});

describe("flameTier", () => {
  it("returns none for streak 0", () => {
    expect(flameTier(0)).toBe("none");
  });

  it("returns spark for streak 1", () => {
    expect(flameTier(1)).toBe("spark");
  });

  it("returns spark for streak 2", () => {
    expect(flameTier(2)).toBe("spark");
  });

  it("returns steady for streak 3", () => {
    expect(flameTier(3)).toBe("steady");
  });

  it("returns blaze for streak 7", () => {
    expect(flameTier(7)).toBe("blaze");
  });

  it("returns inferno for streak 14", () => {
    expect(flameTier(14)).toBe("inferno");
  });

  it("returns inferno for streak beyond 14", () => {
    expect(flameTier(100)).toBe("inferno");
  });
});

describe("flameEmoji", () => {
  it("returns dot for none tier", () => {
    expect(flameEmoji("none")).toBe("·");
  });

  it("returns single flame for spark", () => {
    expect(flameEmoji("spark")).toBe("🔥");
  });

  it("returns double flame for steady", () => {
    expect(flameEmoji("steady")).toBe("🔥🔥");
  });

  it("returns triple flame for blaze", () => {
    expect(flameEmoji("blaze")).toBe("🔥🔥🔥");
  });

  it("returns quad flame for inferno", () => {
    expect(flameEmoji("inferno")).toBe("🔥🔥🔥🔥");
  });
});
