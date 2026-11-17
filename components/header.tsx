"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { liveProduct, popularSearches, shopEntrances, styleList, suggestionsFor } from "@/lib/catalog";
import { formatINR } from "@/lib/money";
import { withStoreSale } from "@/lib/sale";
import { announcementCopy, announcementLink, useStore } from "@/lib/store";

export function Header() {
  const { totals, settings } = useStore();
  const announcement = settings.announcementEnabled === false ? "" : announcementCopy(settings);
  const announcementHref = announcementLink(settings.announcementHref);
  const links = shopEntrances().map((category) => ({ href: `/shop?category=${category.slug}`, label: category.label }));
  const styleLinks = styleList().map((style) => ({ href: `/shop?style=${style.slug}`, label: style.label }));
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [tick, setTick] = useState(false);
  const seenCount = useRef(false);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menu || search ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu, search]);

  useEffect(() => {
    if (!seenCount.current) {
      seenCount.current = true;
      return;
    }
    setTick(true);
    const timer = window.setTimeout(() => setTick(false), 280);
    return () => window.clearTimeout(timer);
  }, [totals.count]);

  return (
    <header className="site-header">
      {announcement && (
        <div className="bg-ink text-center text-[12px] tracking-wide text-cream">
          {announcementHref ? (
            announcementHref.startsWith("/") ? (
              <Link href={announcementHref} className="block px-4 py-2.5 hover:underline">
                {announcement}
              </Link>
            ) : (
              <a href={announcementHref} className="block px-4 py-2.5 hover:underline">
                {announcement}
              </a>
            )
          ) : (
            <p className="px-4 py-2.5">{announcement}</p>
          )}
        </div>
      )}
      <div className="nav-bar bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-[76px] md:gap-8 md:px-8">
          <div className="flex min-w-0 items-center">
            <button
              className="flex h-11 w-11 items-center justify-center md:hidden"
              aria-label="Open menu"
              onClick={() => setMenu(true)}
            >
              <span className="flex w-5 flex-col gap-1.5">
                <span className="h-px bg-ink" />
                <span className="h-px bg-ink" />
                <span className="h-px bg-ink" />
              </span>
            </button>
            <Link href="/" className="serif text-[26px] leading-none tracking-tight md:text-[32px]">
              Earthen
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setSearch(true)}
            className="hidden h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-[#f5f5f5] px-4 text-left text-sm text-muted md:flex"
          >
            <Icon name="search" className="h-4 w-4 shrink-0" />
            <span className="truncate">Search grills, machines, bakeware…</span>
          </button>

          <div className="ml-auto flex items-center gap-1 text-sm md:gap-2">
            <button className="flex h-11 w-11 items-center justify-center md:hidden" onClick={() => setSearch(true)} aria-label="Search">
              <Icon name="search" />
            </button>
            <Link href="/account" className="hidden h-11 items-center gap-1.5 px-2 md:flex">
              <Icon name="user" className="h-4 w-4" />
              Account
            </Link>
            <Link href="/cart" className="flex h-11 items-center gap-1.5 px-2" aria-label={`Bag, ${totals.count} items`}>
              <Icon name="bag" className={`h-4 w-4 ${tick ? "bag-pop" : ""}`} />
              <span className="hidden sm:inline">Bag</span>
              <span>
                (<span className={tick ? "count-tick" : undefined}>{totals.count}</span>)
              </span>
            </Link>
          </div>
        </div>
        <nav aria-label="Shop" className="hidden border-t border-line md:block">
          <ul className="mx-auto flex max-w-7xl items-center gap-x-8 gap-y-2 overflow-x-auto px-8 py-3 text-[13px]">
            {links.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link href={link.href} className="whitespace-nowrap hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {menu && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <span className="serif text-2xl">Earthen</span>
            <button className="flex h-11 w-11 items-center justify-center" onClick={() => setMenu(false)} aria-label="Close menu">
              <Icon name="close" />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-6 text-2xl serif">
            {links.map((link, index) => (
              <Link key={link.href} href={link.href} className="menu-link border-b border-line py-4" style={{ ["--i" as string]: index }} onClick={() => setMenu(false)}>
                {link.label}
              </Link>
            ))}
            {styleLinks.length > 0 && (
              <div className="menu-link border-b border-line py-4" style={{ ["--i" as string]: links.length }}>
                <p className="eyebrow font-sans text-muted">Shop by style</p>
                <div className="mt-3 flex flex-wrap gap-2 font-sans text-sm">
                  {styleLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="border border-line px-3 py-2" onClick={() => setMenu(false)}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {[{ href: "/about", label: "Our story" }, { href: "/account", label: "Account" }, { href: "/help", label: "Help" }].map((link, index) => (
              <Link key={link.href} href={link.href} className="menu-link border-b border-line py-4 last:border-0" style={{ ["--i" as string]: links.length + 1 + index }} onClick={() => setMenu(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {search && <SearchOverlay query={query} setQuery={setQuery} onClose={() => setSearch(false)} />}
    </header>
  );
}

function SearchOverlay({
  query,
  setQuery,
  onClose,
}: {
  query: string;
  setQuery: (value: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const { overrides, settings } = useStore();
  const matches = suggestionsFor(query, overrides).map((product) => withStoreSale(liveProduct(product, overrides[product.slug]), settings));

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = query.trim();
    if (!next) return;
    router.push(`/search?q=${encodeURIComponent(next)}`);
    onClose();
  }

  return (
    <div className="search-pop fixed inset-0 z-50 bg-white">
      <form onSubmit={submit} className="mx-auto flex h-16 max-w-3xl items-center gap-3 border-b border-line px-4">
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search"
          className="h-11 flex-1 bg-transparent outline-none"
        />
        <button type="submit" className="text-sm">
          Search
        </button>
        <button type="button" className="flex h-11 w-11 items-center justify-center text-muted" onClick={onClose} aria-label="Close search">
          <Icon name="close" />
        </button>
      </form>
      <div className="mx-auto max-w-3xl px-4 py-6">
        {query.trim() && matches.length > 0 && (
          <ul className="divide-y divide-line border-y border-line">
            {matches.map((product) => (
              <li key={product.slug}>
                <Link href={`/product/${product.slug}`} className="flex items-center gap-4 py-3">
                  <span className="h-14 w-12" style={{ background: product.colors[0].hex }} />
                  <span>
                    <span className="block">{product.name}</span>
                    <span className="text-sm text-muted">
                      {formatINR(product.price)}
                      {product.price < product.basePrice && <span className="ml-2 line-through">{formatINR(product.basePrice)}</span>}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {query.trim() && (
          <Link href={`/search?q=${encodeURIComponent(query.trim())}`} className="mt-4 inline-block text-sm underline">
            View all results
          </Link>
        )}
        <p className="eyebrow mt-8 text-muted">Popular searches</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="border border-line px-3 py-2 text-sm"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
