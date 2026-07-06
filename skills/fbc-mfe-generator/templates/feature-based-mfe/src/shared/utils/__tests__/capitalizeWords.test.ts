import { capitalizeWords } from "../capitalizeWords";

describe("capitalizeWords utility", () => {
  it("should capitalize the first letter of each word and lowercase the rest", () => {
    expect(capitalizeWords("HELLO WORLD FROM SHIPMENT"))
      .toBe("Hello World From Shipment");
  });

  it("should handle mixed case input", () => {
    expect(capitalizeWords("hELLo WoRLD"))
      .toBe("Hello World");
  });

  it("should handle single word input", () => {
    expect(capitalizeWords("SHIPMENT"))
      .toBe("Shipment");
  });

  it("should handle empty string", () => {
    expect(capitalizeWords("")).toBe("");
  });

  it("should handle multiple spaces between words", () => {
    expect(capitalizeWords("HELLO   WORLD"))
      .toBe("Hello   World");
  });

  it("should handle punctuation correctly", () => {
    expect(capitalizeWords("HELLO, WORLD!"))
      .toBe("Hello, World!");
  });
});
