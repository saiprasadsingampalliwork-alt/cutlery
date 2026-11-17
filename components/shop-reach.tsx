"use client";

import { phoneHref, siteContent } from "@/lib/site";
import { useStore } from "@/lib/store";

export function ShopReach() {
  const shop = siteContent(useStore().settings);
  return (
    <>
      If you want to talk to a person, call {shop.phone} or write to {shop.email}. {shop.hours}.
    </>
  );
}
