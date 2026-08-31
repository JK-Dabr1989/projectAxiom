import { describe, expect, it, vi } from "vitest";
import { lookupOpenFoodFacts, normalizeBarcode } from "../src/data/openFoodFacts";

describe("Open Food Facts barcode mapping", () => {
  it("normalizes barcode input to Android-style digits only", () => {
    expect(normalizeBarcode(" 50-0011 abc 2548167 ")).toBe("5000112548167");
  });

  it("rejects unsupported barcode lengths before network lookup", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(lookupOpenFoodFacts("123")).resolves.toEqual({ kind: "invalid", reason: "Barcode must be 8 to 14 digits" });
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("maps returned product data into a review draft", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      json: async () => ({
        status: 1,
        product: {
          product_name: "Test oats",
          brands: "Axiom Test",
          nutriments: {
            "energy-kcal_100g": 370,
            proteins_100g: 12,
            carbohydrates_100g: 60,
            fat_100g: 7,
          },
        },
      }),
    })));
    await expect(lookupOpenFoodFacts("12345678")).resolves.toEqual({
      kind: "found",
      draft: {
        barcode: "12345678",
        displayName: "Test oats",
        brandName: "Axiom Test",
        kcal100g: 370,
        protein100g: 12,
        carbs100g: 60,
        fat100g: 7,
      },
    });
    vi.unstubAllGlobals();
  });
});
