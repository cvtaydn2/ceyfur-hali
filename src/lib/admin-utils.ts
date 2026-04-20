/**
 * Zod format() çıktısından belirli bir path için hata mesajını çeker.
 * Örn: getZodError(errors, "items", 0, "slug")
 */
export function getZodError(errors: any, ...path: (string | number)[]): string | undefined {
  if (!errors || Object.keys(errors).length === 0) return undefined;

  let current = errors;
  for (const segment of path) {
    if (!current || typeof current !== "object") return undefined;
    current = current[segment];
  }

  return current?._errors?.[0];
}

/**
 * Hizmet listesi için varsayılan boş obje üretir.
 */
export function createEmptyServiceItem() {
  return {
    id: crypto.randomUUID(),
    slug: "",
    title: "",
    description: "",
    icon: "Brush",
    image: "",
    features: [],
  };
}

/**
 * Fiyat listesi için varsayılan boş obje üretir.
 */
export function createEmptyPricingItem() {
  return {
    id: crypto.randomUUID(),
    type: "",
    price: 0,
    unit: "m²",
    note: "",
  };
}
