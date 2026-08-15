"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { ECWID_STORE_ID, type EcwidProduct } from "@/lib/content";

/*
  Ecwid single-product widgets.

  Two things about the snippets Ecwid hands you that do not survive a paste into
  React:

  1. An inline <script> inside JSX never runs. React does not evaluate script
     tags it renders, so pasting the snippet as markup gives you four empty divs
     and no error. The script has to be loaded by next/script and `xProduct()`
     called by hand.

  2. Each snippet carries its own copy of the same store script. Four products
     means four identical downloads of the same file, and four calls to
     `xProduct()` racing each other. It is loaded once here, and `xProduct()` is
     called once after it, because it walks the DOM and renders every `.ecsp`
     block it finds rather than one at a time.

  The empty divs are not placeholders to be filled in. Ecwid reads the microdata
  off them, replaces their contents with the live product, and takes the price
  and title from the store rather than from the attributes. The attributes are
  what it matches on, so they are reproduced exactly as generated.
*/

declare global {
  interface Window {
    xProduct?: () => void;
  }
}

/*
  `customprop` is Ecwid's own attribute and is not in any HTML spec, so React
  renders it happily and TypeScript refuses it. Declared rather than cast away
  with `as any`: the cast would silence every other typo on those elements too,
  and these four slots are the entire product layout.
*/
declare module "react" {
  // The type parameter must match React's own signature exactly or the
  // augmentation stops merging, which quietly removes `children` from every
  // element in the app. It is unused here by nature.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    customprop?: "options" | "qty" | "addtobag" | "vatinprice";
  }
}

export function EcwidProducts({ products }: { products: readonly EcwidProduct[] }) {
  const rendered = useRef(false);

  const render = () => {
    if (rendered.current) return;
    if (typeof window.xProduct !== "function") return;
    rendered.current = true;
    window.xProduct();
  };

  // The script may already be present on a client-side navigation back to this
  // page, in which case onReady has nothing left to fire.
  useEffect(() => {
    render();
  });

  return (
    <>
      {products.map((product) => (
        <div key={product.id} className="ecwid-slot">
          <div
            className={`ecsp ecsp-SingleProduct-v2 ecsp-SingleProduct-v2-bordered ecsp-SingleProduct-v2-centered ecsp-Product ec-Product-${product.id}`}
            itemScope
            itemType="http://schema.org/Product"
            data-single-product-id={product.id}
          >
            <div itemProp="image" />
            <div className="ecsp-title" itemProp="name" content={product.name} />
            <div itemType="http://schema.org/Offer" itemScope itemProp="offers">
              <div
                className="ecsp-productBrowser-price ecsp-price"
                itemProp="price"
                content={product.price}
                data-spw-price-location="button"
              >
                <div itemProp="priceCurrency" content="USD" />
              </div>
            </div>
            <div customprop="options" />
            <div customprop="qty" />
            <div customprop="addtobag" />
            <div customprop="vatinprice" />
          </div>
        </div>
      ))}

      <Script
        src={`https://app.ecwid.com/script.js?${ECWID_STORE_ID}&data_platform=singleproduct_v2`}
        strategy="afterInteractive"
        data-cfasync="false"
        charSet="utf-8"
        onReady={render}
      />
    </>
  );
}
