import type { Silhouette } from "@/lib/shop";
import { kitchenPieces } from "./kitchen";

// Each piece carries the sizes printed for it: a diameter, a length, or Lite and Heavy.
export type Size = string;

export type Colorway = {
  name: string;
  hex: string;
};

export type Category = string;

export type ShopCategory = {
  slug: string;
  label: string;
  blurb: string;
  image: string;
  chart: "upper" | "lower";
  /** Position in the drawer, footer, and shop tabs. */
  sort?: number;
};

// The audience slug a product is for. Audiences are managed in the admin.
export type Gender = string;

export type AudienceGroup = "adults" | "kids" | "baby";

export type Audience = {
  slug: string;
  label: string;
  group: AudienceGroup;
  /** Shown under every audience in the same group, like Unisex or Kids unisex. */
  shared: boolean;
  sizes: Size[];
  active: boolean;
  sort: number;
};

export type Review = {
  name: string;
  rating: number;
  text: string;
  size: Size;
  fit: string;
  heightCm: number;
  color: string;
};

export type ProductPhoto = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: Category;
  /** Stored on the product. Omitted only on local samples, which fall back to the slug map. */
  gender?: Gender;
  silhouette: Silhouette;
  colors: Colorway[];
  sizes: Size[];
  /** Units available for `${colorName}|${size}`. Missing keys are out of stock. */
  stock: Record<string, number>;
  fabric: string;
  /** Detail shown after the material, like "26 cm". */
  fabricDetail?: string;
  /** Style slugs, like everyday or festive, managed under Admin › Styles. */
  styles?: string[];
  origin: string;
  fit: string;
  model: { heightCm: number; size: Size };
  description: string;
  details: string[];
  care: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  reviews: Review[];
  photos?: ProductPhoto[];
  shot?: string;
};

export const SIZES: Size[] = ["Small", "Medium", "Large"];

export const AUDIENCE_GROUPS: { id: AudienceGroup; label: string }[] = [
  { id: "adults", label: "Kitchen" },
  { id: "kids", label: "Kids" },
  { id: "baby", label: "Baby" },
];

export const GROUP_SIZES: Record<AudienceGroup, Size[]> = {
  adults: ["Small", "Medium", "Large"],
  kids: ["Small", "Medium"],
  baby: ["Small"],
};

// Used until the API answers, and if it cannot be reached. Mirrors the server's defaults.
const DEFAULT_AUDIENCES: Audience[] = [
  { slug: "everyday", label: "Everyday", group: "adults", shared: false, sizes: ["Small", "Medium", "Large"], active: true, sort: 0 },
  { slug: "baking", label: "Baking", group: "adults", shared: false, sizes: ["Small", "Medium", "Large"], active: true, sort: 1 },
  { slug: "parties", label: "Parties", group: "adults", shared: false, sizes: ["Lite", "Heavy"], active: true, sort: 2 },
  { slug: "commercial", label: "Commercial", group: "adults", shared: false, sizes: ["Standard"], active: true, sort: 3 },
  { slug: "hosting", label: "Hosting", group: "adults", shared: false, sizes: GROUP_SIZES.adults, active: false, sort: 4 },
  { slug: "open-stock", label: "Open stock", group: "adults", shared: true, sizes: GROUP_SIZES.adults, active: false, sort: 5 },
];

let installedAudiences: Audience[] | null = null;

/** Every audience, including switched-off ones (staff only receive those). */
export function allAudiences() {
  return installedAudiences ?? DEFAULT_AUDIENCES;
}

// Clothing and earlier tableware audiences. They stay in stored data so old orders still resolve, and stay out of the admin.
const RETIRED_AUDIENCES = new Set(["women", "men", "unisex", "girls", "boys", "kids-unisex", "baby", "hosting", "open-stock"]);

/** Audiences staff manage for this kitchen catalog. */
export function staffAudiences() {
  return allAudiences().filter((audience) => !RETIRED_AUDIENCES.has(audience.slug));
}

/** Audiences shoppers can browse. */
export function audienceList() {
  return allAudiences().filter((audience) => audience.active);
}

export function audienceOf(slug: string) {
  return allAudiences().find((audience) => audience.slug === slug);
}

export function audienceLabel(slug: string) {
  return audienceOf(slug)?.label ?? slug.replace(/-/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

export function installAudiences(rows: Audience[] | undefined) {
  installedAudiences = rows?.length ? [...rows].sort((left, right) => left.sort - right.sort) : null;
}

export function rememberAudience(audience: Audience) {
  const list = allAudiences();
  const index = list.findIndex((entry) => entry.slug === audience.slug);
  installedAudiences = (index >= 0 ? list.map((entry) => (entry.slug === audience.slug ? audience : entry)) : [...list, audience]).sort((left, right) => left.sort - right.sort);
}

export function forgetAudience(slug: string) {
  installedAudiences = allAudiences().filter((entry) => entry.slug !== slug);
}

/** Selected audiences also include the shared pieces of their own group, such as Open stock. */
export function audienceMatcher(selected: string[]) {
  if (!selected.length) return () => true;
  const chosen = new Set(selected);
  const groups = new Set(allAudiences().filter((audience) => chosen.has(audience.slug)).map((audience) => audience.group));
  const shared = new Set(allAudiences().filter((audience) => audience.shared && groups.has(audience.group)).map((audience) => audience.slug));
  return (gender: string) => chosen.has(gender) || shared.has(gender);
}

export function productGender(product: Pick<Product, "slug" | "silhouette"> & { gender?: string }): Gender {
  if (product.gender) return product.gender;
  return "everyday";
}

const NEW_IN: ShopCategory = {
  slug: "new",
  label: "New in",
  blurb: "Just arrived for the kitchen",
  image: "/photos/hero-bake.jpg",
  chart: "upper",
};

export const PLACEHOLDER_IMAGE = "/photos/placeholder.svg";

export const DEFAULT_CATEGORIES: ShopCategory[] = [
  { slug: "grills", label: "Grills", blurb: "Charcoal grills and kabab rods", image: "/photos/category-grills.jpg", chart: "upper" },
  { slug: "machines", label: "Machines", blurb: "Atta makers, mixers, and fryers", image: "/photos/category-machines.jpg", chart: "upper" },
  { slug: "baking-tools", label: "Baking tools", blurb: "Pins, gloves, mats, and bags", image: "/photos/category-baking-tools.jpg", chart: "upper" },
  { slug: "bakeware", label: "Bakeware", blurb: "Cake moulds, trays, and stands", image: "/photos/category-bakeware.jpg", chart: "upper" },
  { slug: "knives", label: "Knives", blurb: "Bread, shawarma, and pizza knives", image: "/photos/category-knives.jpg", chart: "upper" },
  { slug: "kitchen", label: "Kitchen", blurb: "Flasks, thermometers, and hammers", image: "/photos/category-kitchen.jpg", chart: "upper" },
  { slug: "bar", label: "Bar", blurb: "Shakers, pourers, and beer towers", image: "/photos/category-bar.jpg", chart: "upper" },
  { slug: "spares", label: "Spares", blurb: "Elements, switches, and mixer parts", image: "/photos/category-spares.jpg", chart: "upper" },
  { slug: "equipment", label: "Equipment", blurb: "Ranges, freezers, and work tables", image: "/photos/category-equipment.jpg", chart: "upper" },
];

/** Shop entrances, including New in, which is a filter and not a product category. */
export const CATEGORIES: ShopCategory[] = [NEW_IN, ...DEFAULT_CATEGORIES];

let installedCategories: ShopCategory[] | null = null;

export function categorySlug(value: string) {
  const text = value.trim().toLowerCase();
  if (!text) return "";
  return text
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function categoryList() {
  return installedCategories ?? DEFAULT_CATEGORIES;
}

export function shopEntrances() {
  return [NEW_IN, ...categoryList()];
}

export function installCategories(rows: Array<{ slug: string; label: string; blurb?: string; image?: string; chart?: string; sort?: number }> | undefined) {
  installedCategories = rows?.length ? rows.map(asShopCategory) : null;
}

export function rememberCategory(category: { slug: string; label: string; blurb?: string; image?: string; chart?: string; sort?: number }) {
  const next = asShopCategory(category);
  const list = categoryList();
  const index = list.findIndex((entry) => entry.slug === next.slug);
  installedCategories = index >= 0 ? list.map((entry) => (entry.slug === next.slug ? next : entry)) : [...list, next];
}

/** Puts the categories in the given order, as saved under Admin › Categories. */
export function orderCategories(slugs: string[]) {
  const rank = new Map(slugs.map((slug, index) => [slug, index]));
  installedCategories = [...categoryList()]
    .sort((left, right) => (rank.get(left.slug) ?? slugs.length) - (rank.get(right.slug) ?? slugs.length))
    .map((entry) => ({ ...entry, sort: rank.get(entry.slug) ?? entry.sort }));
}

export function forgetCategory(slug: string) {
  installedCategories = categoryList().filter((entry) => entry.slug !== slug);
}

function asShopCategory(category: { slug: string; label: string; blurb?: string; image?: string; chart?: string; sort?: number }): ShopCategory {
  return {
    slug: category.slug,
    label: category.label,
    blurb: category.blurb ?? "",
    image: category.image ?? "",
    chart: category.chart === "lower" ? "lower" : "upper",
    sort: category.sort,
  };
}

const finishes = {
  Ivory: "#F4EFE6",
  Sand: "#E4D3B8",
  Ink: "#1C1A17",
  Steel: "#C5C8C6",
  Brass: "#C4A574",
  Black: "#2A2925",
  Silver: "#E4E4E4",
  Wood: "#C4A574",
  Red: "#C45C4A",
} as const;

function stockFor(colors: string[], pieceSizes: string[]) {
  const stock: Record<string, number> = {};
  for (const color of colors) {
    for (const size of pieceSizes) {
      stock[`${color}|${size}`] = 12;
    }
  }
  return stock;
}

function careFor(fabric: string) {
  const name = fabric.toLowerCase();
  if (name.includes("teflon")) return ["Hand wash", "Use wood or silicone tools"];
  if (name.includes("grill")) return ["Let it cool before cleaning", "Empty the ash when it is cold"];
  if (name.includes("silicone") || name.includes("silicon")) return ["Dishwasher safe", "Dry before storing"];
  if (name.includes("bamboo") || name.includes("wood")) return ["Hand wash", "Dry standing"];
  return ["Hand wash", "Dry after washing"];
}

export const products: Product[] = kitchenPieces.map((row) => ({
  slug: row.slug,
  name: row.name,
  price: row.price,
  category: row.category,
  gender: row.gender,
  silhouette: "tee" as const,
  isNew: row.isNew,
  colors: row.colors.map((name) => ({ name, hex: finishes[name] })),
  sizes: row.sizes,
  stock: stockFor([...row.colors], row.sizes),
  fabric: row.fabric,
  fabricDetail: row.fabricDetail,
  styles: row.styles,
  origin: "Supplied from Visakhapatnam",
  fit: row.fit,
  model: { heightCm: 0, size: row.sizes[0] },
  description: row.description,
  details: [row.fabricDetail, row.sizes.join(", "), row.fabric],
  care: careFor(row.fabric),
  rating: row.rating,
  reviewCount: row.reviewCount,
  reviews: [],
  photos: [
    { id: "photo", label: "Photo", src: `/photos/products/${row.slug}.jpg`, alt: row.name },
    { id: "range", label: "In the range", src: `/photos/products/${row.slug}.jpg`, alt: row.name },
  ],
}));

export const popularSearches = ["cake mould", "grill", "knife", "baking", "flask"];


export function stockKey(color: string, size: string) {
  return `${color}|${size}`;
}

export function unitsAvailable(product: Product, color: string, size: string) {
  return product.stock[stockKey(color, size)] ?? 0;
}

export type ProductOverride = {
  price?: number;
  salePrice?: number | null;
  saleStart?: string;
  saleEnd?: string;
  status?: "active" | "draft" | "archived";
  metaTitle?: string;
  metaDescription?: string;
  stock?: Record<string, number>;
};

export type LiveProduct = Product & { status: "active" | "draft" | "archived"; basePrice: number };

export function liveProduct(product: Product, override?: ProductOverride): LiveProduct {
  const status = override?.status ?? "active";
  const stock = override?.stock ?? product.stock;
  const basePrice = override?.price ?? product.price;
  const today = new Date().toISOString().slice(0, 10);
  const saleLive =
    typeof override?.salePrice === "number" &&
    override.salePrice > 0 &&
    (!override.saleStart || today >= override.saleStart) &&
    (!override.saleEnd || today <= override.saleEnd);
  return {
    ...product,
    stock,
    basePrice,
    price: saleLive ? override!.salePrice! : basePrice,
    status,
  };
}

export type Style = { slug: string; label: string; active: boolean; sort: number };

let installedStyles: Style[] = [];

/** Every style, including switched-off ones (staff only receive those). */
export function allStyles() {
  return installedStyles;
}

/** Styles shoppers can filter by. */
export function styleList() {
  return installedStyles.filter((style) => style.active);
}

export function styleLabel(slug: string) {
  return installedStyles.find((style) => style.slug === slug)?.label ?? slug.replace(/-/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

export function installStyles(rows: Style[] | undefined) {
  installedStyles = sortStyles(rows ?? []);
}

export function rememberStyle(style: Style) {
  installedStyles = sortStyles([...installedStyles.filter((entry) => entry.slug !== style.slug), style]);
}

export function forgetStyle(slug: string) {
  installedStyles = installedStyles.filter((entry) => entry.slug !== slug);
}

export function orderStyles(slugs: string[]) {
  const rank = new Map(slugs.map((slug, index) => [slug, index]));
  installedStyles = sortStyles(installedStyles.map((style) => ({ ...style, sort: rank.get(style.slug) ?? style.sort })));
}

function sortStyles(rows: Style[]) {
  return [...rows].sort((left, right) => left.sort - right.sort || left.label.localeCompare(right.label));
}

export type Fabric = { slug: string; label: string };

let installedFabrics: Fabric[] = [];

/** Fabrics staff choose from on products, managed under Admin › Fabrics. */
export function fabricList() {
  return installedFabrics;
}

export function installFabrics(rows: Fabric[] | undefined) {
  installedFabrics = sortFabrics(rows ?? []);
}

export function rememberFabric(fabric: Fabric, previousLabel?: string) {
  installedFabrics = sortFabrics([...installedFabrics.filter((entry) => entry.slug !== fabric.slug), fabric]);
  // A rename also renames the fabric on every product, as the API does.
  if (previousLabel && previousLabel !== fabric.label && source) {
    source = source.map((product) => (product.fabric === previousLabel ? { ...product, fabric: fabric.label } : product));
  }
}

export function forgetFabric(slug: string) {
  installedFabrics = installedFabrics.filter((entry) => entry.slug !== slug);
}

function sortFabrics(rows: Fabric[]) {
  return [...rows].sort((left, right) => left.label.localeCompare(right.label));
}

/** "Teflon, Square": the material with its detail, as shoppers see it. */
export function fabricText(product: Pick<Product, "fabric" | "fabricDetail">) {
  return product.fabricDetail ? `${product.fabric}, ${product.fabricDetail}` : product.fabric;
}

export type ApiProduct = {
  slug: string;
  name: string;
  price: number;
  category: string;
  gender?: string;
  fabric: string;
  fabricDetail?: string;
  styles?: unknown;
  description: string;
  details: unknown;
  care: unknown;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  reviews: unknown;
  colors: unknown;
  sizes: unknown;
  stock: unknown;
  silhouette?: string;
  origin?: string;
  fit?: string;
  model?: unknown;
  photos?: unknown;
};

let source: Product[] | null = null;

export function catalogSource() {
  return source ?? products;
}

// True once the live catalog has come from the API, so a missing slug really is not in the shop.
export function catalogLoaded() {
  return source !== null;
}

// Drafts, archived pieces, and pieces for a switched-off audience stay out of every shopper-facing list.
export function onSale(slug: string, overrides: Record<string, ProductOverride | undefined>) {
  if ((overrides[slug]?.status ?? "active") !== "active") return false;
  const product = getProduct(slug);
  const audience = product ? audienceOf(productGender(product)) : undefined;
  return !audience || audience.active;
}

/** A stand-in photo for an audience's homepage tile: its first product with a real photo. */
export function audiencePhoto(slug: string) {
  const label = audienceLabel(slug);
  for (const product of catalogSource()) {
    if (productGender(product) !== slug) continue;
    const photo = product.photos?.find((item) => item.src && item.src !== PLACEHOLDER_IMAGE);
    if (photo) return { src: photo.src, alt: `${label}: ${product.name}` };
  }
  return { src: PLACEHOLDER_IMAGE, alt: `${label}. Photo to be added.` };
}

/**
 * The picture for a category tile: its own photo, or else the first real photo from a product in it
 * that shoppers can see, or else the "photo to come" drawing. A category made from the product form
 * starts without a photo, so its tile is never left empty.
 */
export function categoryPhoto(category: Pick<ShopCategory, "slug" | "label" | "image">, overrides: Record<string, ProductOverride | undefined> = {}) {
  if (category.image) return { src: category.image, own: true };
  for (const product of catalogSource()) {
    if (product.category !== category.slug || !onSale(product.slug, overrides)) continue;
    const photo = product.photos?.find((item) => item.src && item.src !== PLACEHOLDER_IMAGE);
    if (photo) return { src: photo.src, own: false };
  }
  return { src: PLACEHOLDER_IMAGE, own: false };
}

/** "20 in, 22 in" into a clean list, keeping the order given and dropping repeats. */
export function parseSizes(value: string) {
  const seen = new Set<string>();
  return value
    .split(",")
    .map((size) => size.replace(/\|/g, "").trim().replace(/\s+/g, " ").slice(0, 12))
    .filter((size) => size && !seen.has(size.toLowerCase()) && seen.add(size.toLowerCase()));
}

export function rememberProduct(product: Product) {
  source = [...catalogSource().filter((entry) => entry.slug !== product.slug), product];
}

export function forgetProduct(slug: string) {
  source = catalogSource().filter((entry) => entry.slug !== slug);
}

export function installCatalog(rows: ApiProduct[] | undefined) {
  if (!rows?.length) {
    source = null;
    return;
  }
  source = rows.map(toProduct);
}

function storedPhotos(value: unknown): ProductPhoto[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const src = String((item as ProductPhoto).src ?? "").trim();
    if (!isPhotoSrc(src)) return [];
    return [{
      id: String((item as ProductPhoto).id ?? "photo"),
      label: String((item as ProductPhoto).label ?? "Photo"),
      src,
      alt: String((item as ProductPhoto).alt ?? ""),
    }];
  });
}

export function toProduct(row: ApiProduct): Product {
  const known = products.find((product) => product.slug === row.slug);
  const photos = storedPhotos(row.photos);
  const category = categorySlug(row.category) || known?.category || "bakeware";
  const silhouette = (row.silhouette || known?.silhouette || "tee") as Silhouette;
  return {
    slug: row.slug,
    name: row.name,
    price: row.price,
    category,
    gender: row.gender || productGender({ slug: row.slug, silhouette, gender: known?.gender }),
    silhouette,
    colors: (Array.isArray(row.colors) ? row.colors : known?.colors ?? []) as Colorway[],
    sizes: (Array.isArray(row.sizes) ? row.sizes : known?.sizes ?? SIZES) as Size[],
    stock: (row.stock && typeof row.stock === "object" ? row.stock : known?.stock ?? {}) as Record<string, number>,
    fabric: row.fabric || known?.fabric || "Stainless steel",
    fabricDetail: row.fabric ? row.fabricDetail ?? "" : known?.fabricDetail,
    styles: Array.isArray(row.styles) ? row.styles.map(String) : known?.styles ?? [],
    origin: row.origin || known?.origin || "Finished in Visakhapatnam",
    fit: row.fit || known?.fit || "See the dimensions on this piece.",
    model: (row.model as Product["model"]) || known?.model || { heightCm: 0, size: "Standard" },
    description: row.description || known?.description || "",
    details: Array.isArray(row.details) && row.details.length ? (row.details as string[]) : known?.details ?? [],
    care: Array.isArray(row.care) && row.care.length ? (row.care as string[]) : known?.care ?? ["Dishwasher safe"],
    rating: row.rating ?? known?.rating ?? 0,
    reviewCount: row.reviewCount ?? known?.reviewCount ?? 0,
    isNew: row.isNew ?? known?.isNew,
    reviews: mergeReviews(row.reviews, known?.reviews),
    photos: photos.length
      ? photos
      : known?.photos?.length
        ? known.photos
        : known
          ? undefined
          : [{ id: "photo", label: "Photo", src: PLACEHOLDER_IMAGE, alt: `${row.name}. Photo to be added.` }],
    shot: known?.shot,
  };
}

function mergeReviews(value: unknown, samples: Review[] = []): Review[] {
  const incoming = Array.isArray(value) ? (value as Partial<Review>[]) : [];
  if (!incoming.length) return samples;
  return incoming.map((review) => {
    const sample = !review.size && !review.fit ? samples.find((item) => item.name === review.name) : undefined;
    return {
      name: review.name || "Customer",
      rating: Number(review.rating ?? sample?.rating ?? 0),
      text: review.text || sample?.text || "",
      size: (review.size || sample?.size || "") as Size,
      fit: review.fit || sample?.fit || "",
      heightCm: Number(review.heightCm || sample?.heightCm || 0),
      color: review.color || sample?.color || "",
    };
  });
}

export function getProduct(slug: string) {
  return catalogSource().find((product) => product.slug === slug);
}

export function categoryLabel(slug: string) {
  const known = shopEntrances().find((category) => category.slug === slug);
  if (known) return known.label;
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function filterProducts<T extends Product = Product>(options: {
  category?: string;
  query?: string;
  sizes?: string[];
  colors?: string[];
  genders?: string[];
  /** Matches products with any of these styles. */
  styles?: string[];
  min?: number;
  max?: number;
  inStock?: boolean;
  sort?: string;
  source?: readonly T[];
}): T[] {
  const query = options.query?.trim().toLowerCase() ?? "";
  const rows: T[] = options.source ? [...options.source] : (catalogSource() as T[]);
  const matchesAudience = audienceMatcher(options.genders ?? []);
  let list = rows.filter((product) => {
    if (options.category === "new" && !product.isNew) return false;
    if (options.category && options.category !== "new" && options.category !== "all" && product.category !== options.category) {
      return false;
    }
    const gender = productGender(product);
    if (query) {
      const haystack = `${product.name} ${fabricText(product)} ${product.origin} ${product.description} ${product.category} ${audienceLabel(gender)} ${audienceOf(gender)?.group ?? ""} ${(product.styles ?? []).map(styleLabel).join(" ")} ${product.colors.map((color) => color.name).join(" ")}`.toLowerCase();
      const tokens = query.split(/\s+/);
      if (!tokens.every((token) => haystack.includes(token) || close(haystack, token))) return false;
    }
    if (!matchesAudience(gender)) return false;
    if (options.styles?.length && !(product.styles ?? []).some((style) => options.styles!.includes(style))) return false;
    if (options.sizes?.length && !options.sizes.some((size) => product.sizes.includes(size) && Object.entries(product.stock).some(([key, qty]) => key.endsWith(`|${size}`) && qty > 0))) {
      return false;
    }
    if (options.colors?.length && !product.colors.some((color) => options.colors!.includes(color.name))) return false;
    if (options.min != null && product.price < options.min) return false;
    if (options.max != null && product.price > options.max) return false;
    if (options.inStock && !Object.values(product.stock).some((qty) => qty > 0)) return false;
    return true;
  });

  const sort = options.sort ?? "newest";
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  else if (sort === "popular") list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
  else list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));

  return list;
}

function close(haystack: string, token: string) {
  if (token.length < 4) return false;
  return haystack.split(/\s+/).some((word) => {
    if (Math.abs(word.length - token.length) > 1) return false;
    let misses = 0;
    const length = Math.max(word.length, token.length);
    for (let i = 0; i < length; i += 1) {
      if (word[i] !== token[i]) misses += 1;
    }
    return misses <= 1;
  });
}

export function suggestionsFor(query: string, overrides: Record<string, ProductOverride | undefined> = {}) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return filterProducts({ query: q }).filter((product) => onSale(product.slug, overrides)).slice(0, 3);
}

export function relatedProducts(slug: string) {
  const current = getProduct(slug);
  const list = catalogSource();
  if (!current) return list.slice(0, 4);
  return list.filter((product) => product.slug !== slug && product.category === current.category).concat(
    list.filter((product) => product.slug !== slug && product.category !== current.category),
  ).slice(0, 4);
}

/** Our own photos (/photos, /uploads) or images on Cloudinary; nothing else is shown as a photo. */
export function isPhotoSrc(src: string) {
  if (src.includes("..")) return false;
  return src.startsWith("/photos/") || src.startsWith("/uploads/") || /^https:\/\/res\.cloudinary\.com\/[a-z0-9_-]+\/image\/upload\/[A-Za-z0-9_.\/,-]+$/i.test(src);
}
