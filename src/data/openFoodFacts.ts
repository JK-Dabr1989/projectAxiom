export interface OpenFoodFactsDraft {
  barcode: string;
  displayName: string;
  brandName: string;
  kcal100g: number | null;
  protein100g: number | null;
  carbs100g: number | null;
  fat100g: number | null;
}

export type OpenFoodFactsLookupResult =
  | { kind: "found"; draft: OpenFoodFactsDraft }
  | { kind: "not-found"; barcode: string }
  | { kind: "invalid"; reason: string }
  | { kind: "error"; message: string };

const fields = "code,product_name,generic_name,brands,nutriments";

export function normalizeBarcode(value: string): string {
  return value.replace(/\D/g, "");
}

export async function lookupOpenFoodFacts(rawBarcode: string): Promise<OpenFoodFactsLookupResult> {
  const barcode = normalizeBarcode(rawBarcode);
  if (barcode.length < 8 || barcode.length > 14) return { kind: "invalid", reason: "Barcode must be 8 to 14 digits" };
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=${fields}`, {
      headers: { Accept: "application/json" },
    });
    const root = await response.json();
    if (root.status !== 1 || !root.product) return { kind: "not-found", barcode };
    const product = root.product;
    const nutriments = product.nutriments ?? {};
    const displayName = String(product.product_name || product.generic_name || "").trim();
    if (!displayName) return { kind: "not-found", barcode };
    return {
      kind: "found",
      draft: {
        barcode,
        displayName,
        brandName: String(product.brands || "").split(",")[0]?.trim() ?? "",
        kcal100g: numberOrNull(nutriments["energy-kcal_100g"] ?? nutriments["energy-kcal"] ?? nutriments.energy_kcal_100g ?? nutriments.energy_kcal),
        protein100g: numberOrNull(nutriments.proteins_100g ?? nutriments.proteins),
        carbs100g: numberOrNull(nutriments.carbohydrates_100g ?? nutriments.carbohydrates),
        fat100g: numberOrNull(nutriments.fat_100g ?? nutriments.fat),
      },
    };
  } catch {
    return { kind: "error", message: "Unable to reach Open Food Facts right now." };
  }
}

function numberOrNull(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(number) ? number : null;
}
