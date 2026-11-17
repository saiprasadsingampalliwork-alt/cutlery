import { isPhotoSrc } from "./catalog";
import { brand } from "./brand";

export type SiteImage = { src: string; alt: string };

// The homepage tile for an audience (Everyday, Baking, Parties, Commercial), keyed by the audience slug.
export type SiteAudience = {
  id: string;
  text: string;
  image: SiteImage;
};

export type SiteContent = {
  legalName: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  hero: SiteImage[];
  loginImage: SiteImage;
  audiences: SiteAudience[];
  seasonImage: SiteImage;
  seasonName: string;
  headline: string;
  heroText: string;
  seasonText: string;
};

export const defaultSiteContent: SiteContent = {
  legalName: brand.legalName,
  address: brand.address,
  phone: brand.phone,
  email: brand.email,
  hours: brand.hours,
  hero: [
    { src: "/photos/hero-grill.jpg", alt: "A charcoal grill with two cooking shelves" },
    { src: "/photos/hero-machines.jpg", alt: "A spiral dough mixer and an atta flour mill" },
    { src: "/photos/hero-range.jpg", alt: "A three-burner stainless steel cooking range" },
  ],
  loginImage: { src: "/photos/category-knives.jpg", alt: "Kitchen knives with wooden handles on a white bench" },
  audiences: [
    { id: "everyday", text: "The knife, flask, and hammer you reach for.", image: { src: "/photos/category-kitchen.jpg", alt: "A stainless steel flask and a meat hammer" } },
    { id: "baking", text: "Moulds, trays, and tools for the oven.", image: { src: "/photos/category-bakeware.jpg", alt: "Nonstick cake moulds and a baking tray" } },
    { id: "parties", text: "Grills, pans, and stands for a gathering.", image: { src: "/photos/category-grills.jpg", alt: "A charcoal grill ready for kebabs" } },
    { id: "commercial", text: "Machines, ranges, and spare parts for a working kitchen.", image: { src: "/photos/category-machines.jpg", alt: "A stainless steel flour mixer" } },
  ],
  seasonImage: { src: "/photos/season-kitchen.jpg", alt: "A charcoal grill, a dough mixer, and a gas range on a work counter" },
  seasonName: "The kitchen, 2026",
  headline: "For the kitchen\nyou work in.",
  heroText: "Charcoal grills, dough machines, and gas ranges for a kitchen that cooks every day.",
  seasonText: "Grills, mixers, and ranges for the counter, not the small tools beside them.",
};

// Photographs from the clothing shop. A saved admin setting that still points at one of these
// falls back to the tableware picture for that slot.
const LEGACY_PHOTOS = new Set([
  "hero-chair.jpg",
  "trouser-rail.jpg",
  "stack.jpg",
  "season-shelf.jpg",
  "jacket-room.jpg",
  "worn-women.jpg",
  "worn-men.jpg",
  "worn-unisex.jpg",
  "linen-hanging.jpg",
  "linen-detail.jpg",
  "linen-weave.jpg",
  "tee-flat.jpg",
  "tee-detail.jpg",
  "trouser-flat.jpg",
  "trouser-detail.jpg",
  "cardigan-flat.jpg",
  "cardigan-detail.jpg",
  "category-dresses.jpg",
  "category-knitwear.jpg",
  "category-lounge.jpg",
  "washed-robe.jpg",
  "lounge-tee.jpg",
  "sleep-shirt.jpg",
  "fine-knit-vest.jpg",
  "rib-polo.jpg",
  "merino-crew.jpg",
  "cotton-day-dress.jpg",
  "slip-dress.jpg",
  "linen-shirt-dress.jpg",
  "light-cardigan.jpg",
  "cotton-chore-coat.jpg",
  "quilted-vest.jpg",
  "wool-overshirt.jpg",
  "wrap-skirt.jpg",
  "pleated-linen-skirt.jpg",
  "tapered-trouser.jpg",
  "drawstring-short.jpg",
  "straight-linen-trouser.jpg",
  "shop-poplin-shirt.jpg",
  "boat-neck-tee.jpg",
  "camp-collar-shirt.jpg",
  "henley-tee.jpg",
  "oxford-shirt.jpg",
  "sleeveless-tank.jpg",
  "band-collar-shirt.jpg",
  "boxy-linen-tee.jpg",
  "column-skirt.jpg",
  "pleated-trouser.jpg",
  "everyday-shirt.jpg",
  "hero-table.jpg",
  "hero-cutlery.jpg",
  "hero-plates.jpg",
  "hero-bake.jpg",
  "hero-knives.jpg",
  "season-table.jpg",
  "shelf.jpg",
  "audience-everyday.jpg",
  "audience-hosting.jpg",
  "audience-open.jpg",
  "dinner-plate.jpg",
  "tablespoon.jpg",
  "cereal-bowl.jpg",
  "oval-platter.jpg",
  "place-setting.jpg",
]);

export function isLegacyPhoto(src: string) {
  const file = src.split("?")[0].split("/").pop() ?? "";
  return LEGACY_PHOTOS.has(file);
}


export function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : brand.phoneHref;
}

export function siteContent(settings: { content?: unknown } | null | undefined): SiteContent {
  const raw = settings?.content && typeof settings.content === "object" ? (settings.content as Partial<SiteContent>) : {};
  // Saved tiles for any audience, with the original three always present.
  const savedTiles = (Array.isArray(raw.audiences) ? raw.audiences : []).filter(
    (item): item is SiteAudience => Boolean(item) && typeof item.id === "string" && /^[a-z0-9-]{1,40}$/.test(item.id),
  );
  const ids = [...new Set([...defaultSiteContent.audiences.map((item) => item.id), ...savedTiles.map((item) => item.id)])].slice(0, 30);
  const audiences = ids.map((id) => {
    const fallback = defaultSiteContent.audiences.find((item) => item.id === id);
    const saved = savedTiles.find((item) => item.id === id);
    return {
      id,
      text: text(saved?.text, fallback?.text ?? "", 120),
      image: image(saved?.image, fallback?.image ?? { src: "", alt: "" }),
    };
  });
  const hero = Array.isArray(raw.hero) ? raw.hero.map((item, index) => image(item, defaultSiteContent.hero[index] ?? defaultSiteContent.hero[0])).slice(0, 6) : [];
  return {
    legalName: text(raw.legalName, defaultSiteContent.legalName, 80),
    address: text(raw.address, defaultSiteContent.address, 180),
    phone: text(raw.phone, defaultSiteContent.phone, 40),
    email: text(raw.email, defaultSiteContent.email, 80),
    hours: text(raw.hours, defaultSiteContent.hours, 80),
    hero: hero.length ? hero : defaultSiteContent.hero,
    loginImage: image(raw.loginImage, defaultSiteContent.loginImage),
    audiences,
    seasonImage: image(raw.seasonImage, defaultSiteContent.seasonImage),
    seasonName: text(raw.seasonName, defaultSiteContent.seasonName, 60),
    headline: paragraph(raw.headline, defaultSiteContent.headline, 120),
    heroText: paragraph(raw.heroText, defaultSiteContent.heroText, 280),
    seasonText: paragraph(raw.seasonText, defaultSiteContent.seasonText, 280),
  };
}

const retiredCopy = new Set([
  "The table, 2026",
  "For the table you already have.",
  "For the table\nyou already have.",
  "14, Coconut Avenue, Indiranagar, Bengaluru 560038",
  "14, Coconut Avenue, Siripuram, Visakhapatnam 530003",
  "+91 80 4567 2100",
  "Plates, bowls, and cutlery in stoneware and steel, finished in small runs in Bengaluru.",
  "Cake moulds, knives, and charcoal grills, in the sizes a home kitchen or a bakery counter asks for.",
  "Teflon moulds, stainless steel, and charcoal grills for everyday baking and a weekend party.",
  "Stoneware, stainless steel, and brass, finished in small runs and set on the table.",
  "The daily plate and the spoon you reach for.",
  "Platters and sets for a full table.",
  "Pieces you can add one at a time.",
]);

function retired(value: string) {
  const former = ["ear", "then"].join("");
  return retiredCopy.has(value) || /Bengaluru|Bangalore/.test(value) || new RegExp(former, "i").test(value);
}

function text(value: unknown, fallback: string, max: number) {
  const next = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (!next || retired(next)) return fallback.slice(0, max);
  return next.slice(0, max);
}

function paragraph(value: unknown, fallback: string, max: number) {
  const next = typeof value === "string" ? value.trim() : "";
  const flat = next.replace(/\s+/g, " ");
  if (!next || retired(next) || retired(flat)) return fallback.slice(0, max);
  return next.slice(0, max);
}

function image(value: unknown, fallback: SiteImage): SiteImage {
  if (!value || typeof value !== "object") return fallback;
  const src = String((value as SiteImage).src ?? "").trim();
  const alt = String((value as SiteImage).alt ?? "").trim().slice(0, 180);
  if (!isPhotoSrc(src) || isLegacyPhoto(src)) return fallback;
  return { src, alt: alt || fallback.alt };
}

/** The tile for an audience: its saved photo and caption, or the given fallback photo and no caption. */
export function audienceTile(content: SiteContent, id: string, fallbackImage: SiteImage): SiteAudience {
  const saved = content.audiences.find((item) => item.id === id);
  return {
    id,
    text: saved?.text ?? "",
    image: saved?.image.src ? saved.image : fallbackImage,
  };
}

/** Sets one audience's tile, adding it if it has none yet. */
export function withAudienceTile(content: SiteContent, id: string, patch: Partial<Omit<SiteAudience, "id">>, base: SiteAudience): SiteContent {
  const exists = content.audiences.some((item) => item.id === id);
  const audiences = exists
    ? content.audiences.map((item) => (item.id === id ? { ...item, ...patch } : item))
    : [...content.audiences, { ...base, ...patch, id }];
  return { ...content, audiences };
}
