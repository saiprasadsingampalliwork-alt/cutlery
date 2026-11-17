import Link from "next/link";
import { ShopReach } from "@/components/shop-reach";

export const metadata = { title: "Our story" };

const chapters = [
  {
    n: "01",
    title: "The counter",
    body: "Two of us started in 2016 with cake moulds and a rolling pin, sold across the counter to bakeries in Dabagardens.",
    href: "/shop?category=bakeware",
    cta: "The moulds",
  },
  {
    n: "02",
    title: "The list",
    body: "Knives, charcoal grills, and dough machines joined the same shelf. The size on the page is the size you receive.",
    href: "/shop",
    cta: "Shop the list",
  },
  {
    n: "03",
    title: "From Visakhapatnam",
    body: "One hundred and seventy-four pieces, packed at Dabagardens. Prices include GST. We collect returns ourselves.",
    href: "/contact",
    cta: "Talk to us",
  },
];

export default function AboutPage() {
  return (
    <article className="bg-[#f3efe6] text-ink">
      <section className="overflow-hidden pb-14 md:pb-20" aria-label="Our story">
        <h1 className="px-4 pt-6 text-center text-[clamp(4.6rem,13vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.045em] md:pt-8">
          One
          <br />
          Kitchen
        </h1>

        <div className="relative z-10 -mt-2 md:-mt-14">
          <div className="grid">
            <div className="story-tear relative col-start-1 row-start-1 aspect-[4/5] min-h-[320px] md:aspect-[16/8]">
              <img
                src="/photos/season-kitchen.jpg"
                alt="A charcoal grill, a dough mixer, and a gas range on a work counter"
                width={1280}
                height={720}
                className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-35% to-[#f3efe6]" />
            </div>

            <div className="relative z-10 col-start-1 row-start-2 flex flex-col md:row-start-1 md:h-full md:justify-between">
              <div className="px-4 py-8 text-center md:pt-[18%]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em]">Ten years on one counter in Visakhapatnam</p>
                <Link
                  href="/shop"
                  className="mt-5 inline-flex h-10 items-center rounded-full bg-terra px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream"
                >
                  Shop the list
                </Link>
              </div>

              <ol className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-2 md:grid-cols-3 md:gap-8 md:px-10 md:pb-14">
                {chapters.map((chapter) => (
                  <li key={chapter.n}>
                    <h2 className="max-w-[16rem] text-[1.65rem] font-bold uppercase leading-[0.95] tracking-tight">
                      <span className="mr-2 text-terra">{chapter.n}</span>
                      {chapter.title}
                    </h2>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-ink/80">{chapter.body}</p>
                    <Link
                      href={chapter.href}
                      className="mt-5 inline-flex h-9 items-center rounded-full bg-terra px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream"
                    >
                      {chapter.cta}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl px-6 text-center text-sm leading-7 text-ink/80">
          <ShopReach />
        </p>
      </section>
    </article>
  );
}
