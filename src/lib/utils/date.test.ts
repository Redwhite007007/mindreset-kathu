import { describe, it, expect } from "vitest";
import { daysBetween, sastDateString } from "./date";

describe("daysBetween", () => {
  it("returns 0 for same date", () => {
    expect(daysBetween("2024-01-15", "2024-01-15")).toBe(0);
  });

  it("returns 1 for consecutive days", () => {
    expect(daysBetween("2024-01-15", "2024-01-16")).toBe(1);
  });

  it("returns negative when b is before a", () => {
    expect(daysBetween("2024-01-16", "2024-01-15")).toBe(-1);
  });

  it("handles month boundaries", () => {
    expect(daysBetween("2024-01-31", "2024-02-01")).toBe(1);
  });

  it("handles leap year (2024 Feb)", () => {
    expect(daysBetween("2024-02-28", "2024-02-29")).toBe(1);
    expect(daysBetween("2024-02-28", "2024-03-01")).toBe(2);
  });

  it("handles non-leap year (2023 Feb)", () => {
    expect(daysBetween("2023-02-28", "2023-03-01")).toBe(1);
  });

  it("handles year boundaries", () => {
    expect(daysBetween("2023-12-31", "2024-01-01")).toBe(1);
  });

  it("returns correct count across weeks", () => {
    expect(daysBetween("2024-01-01", "2024-01-08")).toBe(7);
  });
});

describe("sastDateString", () => {
  it("returns a YYYY-MM-DD string", () => {
    const result = sastDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formats a known UTC timestamp correctly in SAST (UTC+2)", () => {
    // 2024-06-15 22:30 UTC = 2024-06-16 00:30 SAST — should be June 16
    const d = new Date("2024-06-15T22:30:00Z");
    expect(sastDateString(d)).toBe("2024-06-16");
  });

  it("does not roll over at 23:00 SAST (UTC+2)", () => {
    // 2024-06-15 20:59 UTC = 2024-06-15 22:59 SAST — still June 15
    const d = new Date("2024-06-15T20:59:00Z");
    expect(sastDateString(d)).toBe("2024-06-15");
  });

  it("rolls over exactly at SAST midnight", () => {
    // 2024-06-15 22:00 UTC = 2024-06-16 00:00 SAST
    const d = new Date("2024-06-15T22:00:00Z");
    expect(sastDateString(d)).toBe("2024-06-16");
  });
});
