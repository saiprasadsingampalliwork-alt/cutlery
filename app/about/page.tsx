import Link from "next/link";
import { StudioReach } from "@/components/studio-reach";

export const metadata = { title: "Our story" };

const milestones = [
  {
    year: "2016",
    title: "A counter in Indiranagar",
    people: "2",
    body: "Two of us started with cake moulds and a rolling pin, sold across the counter to bakeries nearby.",
    src: "/photos/category-bakeware.jpg",
    alt: "Nonstick cake moulds on a white bench",
    caption: "The first moulds. Teflon, in the sizes bakers asked for.",
    frame: "aspect-square object-cover",
  },
  {
    year: "2018",
    title: "Knives on the wall",
    people: "6",
    body: "Bread knives, shawarma knives, and a magnetic bar joined the moulds. One length sold through before we ordered the next.",
    src: "/photos/category-knives.jpg",
    alt: "Kitchen knives with wooden handles",
    caption: "Steel blades, wooden handles.",
    frame: "aspect-[4/5] object-cover object-center",
  },
  {
    year: "2020",
    title: "Parcels left Bengaluru",
    people: "18",
    body: "The room could not hold another grill. We moved to the ground floor at 14, Coconut Avenue, and the first parcels left the city.",
    src: "/photos/season-kitchen.jpg",
    alt: "Bakeware and a charcoal grill on a work counter",
    caption: "Moulds, tools, and a grill, ready to pack.",
    frame: "aspect-[3/2] object-cover",
  },
  {
    year: "2022",
    title: "The bakery list",
    people: "32",
    body: "Commercial muffin trays, piping bags, and cake stands filled a second shelf. Home bakers and bakery counters ordered from the same list.",
    src: "/photos/category-baking-tools.jpg",
    alt: "Baking gloves, a rolling pin, and a spatula",
    caption: "Tools for the oven, in the sizes on the list.",
    frame: "aspect-[4/5] object-cover",
  },
  {
    year: "2024",
    title: "Grills for the weekend",
    people: "48",
    body: "Charcoal grills, kabab rods, and pizza pans joined the shop for parties. The weekday counter stayed the knives, flasks, and moulds.",
    src: "/photos/category-grills.jpg",
    alt: "A charcoal grill",
    caption: "A grill for a gathering, not for every day.",
    frame: "aspect-[4/5] object-cover object-center",
  },
  {
    year: "2026",
    title: "The kitchen list",
    people: "56",
    body: "One hundred and seventy-four pieces, from a cake mould and a bar shaker to a commercial range. The size on the page is the size you receive. Prices include GST.",
    src: "/photos/category-kitchen.jpg",
    alt: "A stainless steel flask and kitchen tools",
    caption: "Everyday pieces, from this year.",
    frame: "aspect-[3/4] object-cover object-center",
  },
];

const facts = [
  { label: "Started", value: "2016" },
  { label: "People today", value: "56" },
  { label: "Pieces in the shop", value: "174" },
  { label: "Supplied from", value: "Bengaluru" },
];

export default function AboutPage() {
  return (
    <div className="pb-16">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-20">
        <div>
          <p className="eyebrow settle text-muted [--i:0]">Our story</p>
          <h1 className="serif mt-4 text-4xl leading-[1.02] min-[380px]:text-5xl md:text-6xl">
            <span className="line-mask">
              <span className="line-rise" style={{ ["--i" as string]: 0 }}>
                Ten years.
              </span>
            </span>
            <span className="line-mask">
              <span className="line-rise" style={{ ["--i" as string]: 1 }}>
                Still one kitchen.
              </span>
            </span>
          </h1>
          <p className="settle mt-6 max-w-md text-sm leading-7 text-ink/90 [--i:2]">
            Earthen started in 2016 with cake moulds and a rolling pin, sold to bakeries in Indiranagar. The list is longer now. The work is the same: bakeware, knives, and grills in the sizes a kitchen actually uses.
          </p>
        </div>
        <img
          src="/photos/hero-bake.jpg"
          alt="Nonstick cake moulds in square, round, and heart shapes"
          width={1200}
          height={1500}
          className="settle aspect-[4/5] w-full object-cover [--i:1]"
        />
      </section>

      <section className="border-y border-line">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="border-line px-4 py-8 md:border-l md:px-6 md:first:border-l-0">
              <dt className="eyebrow text-muted">{fact.label}</dt>
              <dd className="serif mt-2 text-3xl md:text-4xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <ol className="relative mx-auto max-w-6xl px-4 md:px-6">
        {milestones.map((item, index) => (
          <li key={item.year} className="story-item relative grid gap-6 py-14 pl-10 md:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)] md:items-center md:gap-0 md:py-24 md:pl-0">
            <span className="story-node" aria-hidden="true" />
            <div className={index % 2 === 0 ? "md:col-start-3 md:pl-8" : "md:col-start-1 md:pr-8"}>
              <p className="serif text-5xl leading-none text-olive">{item.year}</p>
              <h2 className="serif mt-3 text-3xl md:text-4xl">{item.title}</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-ink/90">{item.body}</p>
              <p className="mt-6 flex items-baseline gap-3">
                <span className="serif text-3xl">{item.people}</span>
                <span className="text-xs tracking-[0.16em] text-muted">PEOPLE</span>
              </p>
            </div>
            <figure className={index % 2 === 0 ? "md:col-start-1 md:row-start-1 md:pr-8" : "md:col-start-3 md:pl-8"}>
              <img src={item.src} alt={item.alt} width={1200} height={1500} className={`w-full ${item.frame}`} />
              <figcaption className="mt-3 text-xs leading-5 text-muted">{item.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ol>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-4 md:grid-cols-2 md:gap-16 md:px-6 md:pt-8">
        <img
          src="/photos/hero-knives.jpg"
          alt="A bread knife, a shawarma knife, and a pizza cutter"
          width={1200}
          height={1500}
          className="aspect-[4/3] w-full object-cover"
        />
        <div>
          <p className="eyebrow text-muted">From this counter</p>
          <h2 className="serif mt-3 text-4xl leading-[1.05]">The size is named on every piece.</h2>
          <p className="mt-4 text-sm leading-7 text-ink/90">
            Moulds are teflon or aluminium. Knives and flasks are stainless steel. Grills are charcoal. We collect returns ourselves.
          </p>
          <p className="mt-4 text-sm leading-7 text-ink/90">
            <StudioReach />
          </p>
          <Link href="/shop?category=new" className="mt-8 inline-flex h-12 items-center bg-terra px-6 text-sm tracking-[0.16em] text-cream">
            SHOP THE COLLECTION
          </Link>
        </div>
      </section>
    </div>
  );
}
