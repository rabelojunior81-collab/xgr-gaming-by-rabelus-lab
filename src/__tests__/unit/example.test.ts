import { describe, it, expect } from "vitest";

describe("Example Unit Test", () => {
  it("should pass a basic arithmetic test", () => {
    expect(2 + 2).toBe(4);
  });

  it("should verify string operations", () => {
    const str = "Hello, IBVD!";
    expect(str).toContain("IBVD");
    expect(str).toHaveLength(12);
  });

  it("should handle array operations", () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });
});

describe("Chess Engine Basics", () => {
  it("should validate chess coordinates", () => {
    const validFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const validRanks = ["1", "2", "3", "4", "5", "6", "7", "8"];

    expect(validFiles).toContain("e");
    expect(validRanks).toContain("4");
    expect(`${validFiles[4]}${validRanks[3]}`).toBe("e4");
  });
});
