import type { AudienceGroup, Size } from "@/lib/catalog";

const sizes: Size[] = ["Small", "Medium", "Large"];

export function fitHint(reviews: { size?: string; heightCm?: number; fit?: string }[]) {
  const sized = reviews.filter((review) => review.size && typeof review.heightCm === "number" && review.heightCm >= 120);
  const trueToSize = sized.filter((review) => !review.fit || review.fit === "True to size");
  const sample = trueToSize.length >= 2 ? trueToSize : sized;
  if (sample.length < 2) return null;
  const heights = new Map<string, number[]>();
  for (const review of sample) {
    const list = heights.get(review.size!) ?? [];
    list.push(review.heightCm!);
    heights.set(review.size!, list);
  }
  let best: number[] = [];
  for (const list of heights.values()) {
    if (list.length > best.length) best = list;
  }
  const winners = [...heights.entries()].filter(([, list]) => list.length === best.length);
  if (winners.length > 1) {
    const names = winners.map(([name]) => name).join(" and ");
    return `Reviews are split between ${names}.`;
  }
  const size = winners[0][0];
  const sorted = [...best].sort((left, right) => left - right);
  const middle = sorted[Math.floor(sorted.length / 2)];
  const around = Math.round(middle / 5) * 5;
  return `People around ${around} cm mostly take ${size}.`;
}

export function sizeChart(_category: string, productSizes: Size[] = sizes, _group: AudienceGroup = "adults") {
  return {
    caption: "The option is the size printed on the piece: a diameter, a length, or a weight.",
    columns: ["Option", "What you receive"],
    rows: productSizes.map((size) => [size, "This size of the piece"]),
  };
}
