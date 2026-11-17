"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { RecentShelf } from "@/components/recent-shelf";
import { categoryPhoto, catalogSource, onSale, shopEntrances, type Product } from "@/lib/catalog";
import { siteContent } from "@/lib/site";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

const promises: { title: string; text: string; icon: IconName }[] = [
  { title: "Free shipping", text: "On orders over ₹1,999", icon: "truck" },
  { title: "7-day returns", text: "We collect it from you", icon: "returns" },
  { title: "Cash on delivery", text: "Available across India", icon: "card" },
  { title: "Secure payments", text: "UPI, cards, net banking", icon: "lock" },
];

export function StorefrontHome() {
  const { overrides, settings } = useStore();
  const hydrated = useHydrated();
  const content = siteContent(settings);
  const categories = shopEntrances().filter((category) => category.slug !== "new");
  const selling = catalogSource().filter((product) => !hydrated || onSale(product.slug, overrides));
  const bar = bySlug(selling, ["beer-tower-ice", "beer-barrel", "flair-bottle", "liquor-pump", "boston-shaker"]);
  const grills = pick(selling, (product) => product.category === "grills", 5);
  const machines = pick(selling, (product) => product.category === "machines", 5);
  const ranges = bySlug(selling, ["range-1", "range-2", "range-3", "range-combo", "range-chinese"]);
  const loved = bySlug(selling, [
    "chapati-machine",
    "halva-machine",
    "dough-kneader-air",
    "namkin-machine",
    "grill-blower",
    "pizza-oven",
    "wet-grinder",
    "beer-tower",
    "banana-wafer",
    "farshan-mixer",
  ]);

  return (
    <div className="bg-white">
      <RetailHero />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16" aria-labelledby="shop-by-category">
        <h2 id="shop-by-category" className="serif text-center text-3xl md:text-4xl">
          Shop by category
        </h2>
        <div className="mt-6 grid grid-cols-3 gap-x-2 gap-y-5 md:mt-8 md:gap-x-4 md:gap-y-8 lg:grid-cols-5">
          {categories.map((category, index) => (
            <CategoryStage
              key={category.slug}
              label={category.label}
              href={`/shop?category=${category.slug}`}
              offset={index * 700}
              frames={categoryFrames(category.slug, categoryPhoto(category, overrides).src, selling)}
            />
          ))}
        </div>
      </section>

      <ProductBand title="Most loved" href="/shop" products={loved} />

      <ProductBand title="For the bar" href="/shop?category=bar" products={bar} />

      <section className="grid grid-cols-2 items-center bg-[#f6f3ee] md:grid-cols-3">
        <img
          src="/photos/products/grill-shelves.jpg"
          alt="A charcoal grill with two cooking shelves"
          width={1200}
          height={1200}
          className="aspect-square w-full object-contain p-4 md:p-8"
        />
        <img
          src="/photos/products/grill-round.jpg"
          alt="A round charcoal grill on three legs"
          width={1200}
          height={1200}
          className="aspect-square w-full object-contain p-4 md:p-8"
        />
        <div className="col-span-2 flex flex-col justify-center px-6 py-8 md:col-span-1 md:px-10 md:py-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Grills</p>
          <h2 className="serif mt-3 text-4xl leading-[1.05]">For the weekend fire.</h2>
          <p className="mt-4 text-sm leading-6 text-ink/80">
            Charcoal grills, kabab rods, and pizza pans, in the sizes a home gathering actually uses.
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/80">
            The set runs from a two-shelf grill and a round to a table top and a folding X-frame. One has a fitted air blower, so the coals catch without fanning. Kabab rods are sold by length, and the size on the page is the size packed in Visakhapatnam.
          </p>
          <Link href="/shop?category=grills" className="mt-6 inline-flex h-12 w-fit items-center bg-ink px-8 text-xs tracking-[0.16em] text-white">
            SHOP GRILLS
          </Link>
        </div>
      </section>

      <ProductBand title="Grills and kabab rods" href="/shop?category=grills" products={grills} />

      <section className="relative min-h-[460px] bg-ink text-white">
        <img
          src={content.seasonImage.src}
          alt={content.seasonImage.alt}
          width={1584}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto flex min-h-[460px] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em]">{content.seasonName}</p>
          <h2 className="serif mt-3 text-4xl leading-[1.05] md:text-6xl">The working kitchen.</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/85">{content.seasonText}</p>
          <Link href="/shop" className="mt-8 inline-flex h-12 items-center bg-white px-8 text-xs tracking-[0.16em] text-ink">
            SHOP ALL
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <StoryTile href="/shop?category=knives" src="/photos/category-knives.jpg" alt="Kitchen knives with wooden handles" kicker="Knives" title="Steel for the board." />
        <StoryTile href="/shop?category=equipment" src="/photos/hero-range.jpg" alt="A three-burner stainless steel cooking range" kicker="Ranges" title="For the cooking line." />
      </section>

      <ProductBand title="Ranges for the line" href="/shop?category=equipment" products={ranges} />

      <section className="grid grid-cols-2 items-center bg-white md:grid-cols-3">
        <div className="order-3 col-span-2 flex flex-col justify-center px-6 py-8 md:order-1 md:col-span-1 md:px-10 md:py-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Machines</p>
          <h2 className="serif mt-3 text-4xl leading-[1.05]">Mixers, mills, and fryers.</h2>
          <p className="mt-4 text-sm leading-6 text-ink/80">
            Atta makers, spiral mixers, and fryers for a counter that cooks every day. The size on the page is the size you receive.
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/80">
            A home atta maker sits beside the spiral mixer and the flour machines, including the one with a tapela bowl. Chapati, halva, and namkin machines are on the same list, packed in Visakhapatnam.
          </p>
          <Link href="/shop?category=machines" className="mt-6 inline-flex h-12 w-fit items-center bg-ink px-8 text-xs tracking-[0.16em] text-white">
            SHOP MACHINES
          </Link>
        </div>
        <img
          src="/photos/products/spiral-mixer.jpg"
          alt="A stainless steel spiral dough mixer"
          width={1200}
          height={1200}
          className="order-1 aspect-square w-full object-contain p-4 md:order-2 md:p-8"
        />
        <img
          src="/photos/products/atta-maker.jpg"
          alt="A stainless steel atta maker with a hopper"
          width={1200}
          height={1200}
          className="order-2 aspect-square w-full object-contain p-4 md:order-3 md:p-8"
        />
      </section>

      <ProductBand title="Machines for the counter" href="/shop?category=machines" products={machines} />

      <section className="border-y border-line bg-[#f7f6f4]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 md:px-8">
          {promises.map((item) => (
            <div key={item.title} className="text-center md:text-left">
              <Icon name={item.icon} className="mx-auto h-5 w-5 md:mx-0" />
              <p className="mt-3 text-sm">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <RecentShelf hideCategories={["bakeware"]} />
    </div>
  );
}

const SPOTLIGHT: Record<string, string[]> = {
  grills: ["grill-shelves", "grill-round", "kabab-rod"],
  machines: ["spiral-mixer", "atta-maker", "deep-fryer"],
  "baking-tools": ["rolling-pin", "silicon-gloves", "piping-bag"],
  bakeware: ["muffin-tray", "pizza-pan", "bread-mould"],
  knives: ["bread-knife", "pizza-cutter", "knife-holder"],
  kitchen: ["ss-flask", "meat-hammer", "digital-thermometer"],
  bar: ["boston-shaker", "wine-pourer", "peg-measure"],
  spares: ["fryer-element", "on-off-switch", "mixer-whisk"],
  equipment: ["range-2", "work-table-2", "freezer-2"],
};

function categoryFrames(slug: string, cover: string, products: Product[]) {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const shots = (SPOTLIGHT[slug] ?? [])
    .map((item) => bySlug.get(item)?.photos?.[0]?.src)
    .filter((src): src is string => Boolean(src) && src !== cover);
  return [cover, ...shots].filter((src, index, all) => all.indexOf(src) === index).slice(0, 4);
}

function CategoryStage({ label, href, frames, offset }: { label: string; href: string; frames: string[]; offset: number }) {
  const [index, setIndex] = useState(0);
  const hold = useRef(false);

  useEffect(() => {
    if (frames.length < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        if (document.hidden || hold.current) return;
        setIndex((current) => (current + 1) % frames.length);
      }, 4600);
    }, offset);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [frames.length, offset]);

  return (
    <Link
      href={href}
      className="group"
      onMouseEnter={() => {
        hold.current = true;
      }}
      onMouseLeave={() => {
        hold.current = false;
      }}
      onFocus={() => {
        hold.current = true;
      }}
      onBlur={() => {
        hold.current = false;
      }}
    >
      <span className="relative block aspect-square overflow-hidden bg-[#f6f3ee]">
        {frames.map((src, frameIndex) => (
          <img
            key={`${src}-${frameIndex}`}
            src={src}
            alt=""
            width={800}
            height={800}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${frameIndex === index ? "opacity-100 category-drift" : "opacity-0"}`}
          />
        ))}
      </span>
      <p className="mt-2 text-center text-[11px] leading-4 md:mt-3 md:text-sm">{label}</p>
    </Link>
  );
}

function RetailHero() {
  const content = siteContent(useStore().settings);
  const frames = content.hero.slice(0, 3);
  const lines = content.headline.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 3);

  return (
    <section className="relative bg-ink text-white" aria-label="Featured">
      {frames[0] && (
        <img
          src={frames[0].src}
          alt={frames[0].alt}
          width={864}
          height={1152}
          className="h-[calc(100dvh-6.5rem)] w-full object-cover object-center lg:hidden"
        />
      )}
      <div className="hidden lg:grid lg:grid-cols-3">
        {frames.map((frame, frameIndex) => (
          <img
            key={`${frame.src}-${frameIndex}`}
            src={frame.src}
            alt={frame.alt}
            width={864}
            height={864}
            className="aspect-square w-full object-cover object-center"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15" />
      <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end px-4 py-8 md:justify-center md:px-8 md:py-12">
        <p className="text-[11px] uppercase tracking-[0.22em]">{content.seasonName}</p>
        <h1 className="serif mt-4 max-w-xl text-4xl leading-[1.02] md:text-6xl">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-white/85 md:text-base">{content.heroText}</p>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
          <Link href="/shop" className="inline-flex h-12 items-center bg-white px-8 text-xs tracking-[0.16em] text-ink">
            SHOP NOW
          </Link>
          <Link href="/about" className="inline-flex h-12 items-center border border-white px-8 text-xs tracking-[0.16em] text-white">
            OUR STORY
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductBand({ title, href, products }: { title: string; href: string; products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="flex items-end justify-between gap-4">
        <h2 className="serif text-3xl md:text-4xl">{title}</h2>
        <Link href={href} className="shrink-0 text-sm underline underline-offset-4">
          Shop all
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

function StoryTile({ href, src, alt, kicker, title }: { href: string; src: string; alt: string; kicker: string; title: string }) {
  return (
    <Link href={href} className="group relative block min-h-[420px] overflow-hidden bg-ink text-white">
      <img src={src} alt={alt} width={1200} height={900} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
      <span className="relative flex min-h-[420px] flex-col justify-end p-8 md:p-12">
        <span className="text-[11px] uppercase tracking-[0.2em]">{kicker}</span>
        <span className="serif mt-2 text-4xl md:text-5xl">{title}</span>
      </span>
    </Link>
  );
}

function pick(products: Product[], test: (product: Product) => boolean, count: number) {
  return products.filter(test).slice(0, count);
}

function bySlug(products: Product[], slugs: string[]) {
  const by = new Map(products.map((product) => [product.slug, product]));
  return slugs.map((slug) => by.get(slug)).filter((product): product is Product => Boolean(product));
}
