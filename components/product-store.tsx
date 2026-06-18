"use client"

import Image from "next/image"
import { useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  FileSearch,
  FileText,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react"

import { products, siteDisclaimer, type Product } from "@/lib/products"

type ProductTab = "description" | "research"

const palette = {
  ink: "#1c2b34",
  navy: "#2d4e93",
  pale: "#e6edf2",
  text: "#3d4146",
  muted: "#8d969d",
  olive: "#8b9300",
}

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, "")) || 0
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function initials(name: string) {
  const parts = name.match(/[A-Za-z0-9]+/g) || []
  if (!parts.length) return "RX"
  const first = parts[0] ?? "R"
  const second = parts[1]
  if (first.length <= 3 && second) return `${first[0] ?? "R"}${second[0] ?? "X"}`.toUpperCase()
  return parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
}

function displayName(product: Product) {
  return product.name.includes("Wolverine") ? "Wolverine Stack" : product.name
}

function shortCopy(text: string, limit = 210) {
  if (text.length <= limit) return text
  return `${text.slice(0, limit).trim()}...`
}

function normalizeCopy(text: string, tab: ProductTab) {
  const tabName = tab === "description" ? "Description" : "Research"

  return text
    .replace(/\r\n?/g, "\n")
    .replace(new RegExp(`^${tabName}\\s*`, "i"), "")
    .replace(/^Description\s*/i, "")
    .replace(/^Research\s*/i, "")
    .replace(/([a-z0-9.)])(?=Properties of )/g, "$1\n\n")
    .replace(/(Properties of [^\n]+?)(?=Peptide Sequence:|GHK-Cu:|BPC-157:)/g, "$1\n")
    .replace(
      /(?<!\n)(Peptide Sequence:|Chemical Formula:|Molecular Mass:|CAS Number:|PubChem:|Vial Size:|Lyophilized Peptides:|This content is provided strictly|References)/g,
      "\n\n$1",
    )
    .replace(
      /([a-z.)])(?=(Growth Hormone Release|Metabolic Regulation|Neuroprotection|Muscle Homeostasis|Longevity|Efficacy in|Impact on|Effects on|Cardiovascular|Neurocognitive|Angiogenesis|Tissue Repair|Collagen Synthesis|Inflammatory Modulation|Telomere Dynamics|Antioxidant|Melanogenesis|Anti-Inflammatory|Hepatic and|Immune Modulation|Tissue Protection|Wound Healing|Gastrointestinal|Neurological|Cell Migration|Endothelial|Skin|DNA Repair))/g,
      "$1\n\n",
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function isHeading(block: string) {
  const plain = block.replace(/[\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079\u2070.,:;()[\]$/\\]/g, "").trim()
  if (block === "References") return true
  if (block.includes("http")) return false
  return plain.length > 4 && plain.length < 76 && !/[.!?]/.test(block)
}

function CopyBlock({ text, tab }: { text: string; tab: ProductTab }) {
  const blocks = normalizeCopy(text, tab).split(/\n{2,}/).filter(Boolean)

  return (
    <div className="space-y-6 text-[17px] leading-[1.75] text-[#3d4146] md:text-[22px]">
      {blocks.map((block) => {
        const propertyLine =
          /^(Peptide Sequence:|Chemical Formula:|Molecular Mass:|CAS Number:|PubChem:|Vial Size:|Lyophilized Peptides:|GHK-Cu:|BPC-157:|TB-500:|KPV:)/.test(
            block,
          )

        if (isHeading(block)) {
          return (
            <h3 key={block} className="pt-4 font-heading text-3xl font-black leading-tight text-[#1c2b34] md:text-5xl">
              {block}
            </h3>
          )
        }

        if (propertyLine) {
          return (
            <p key={block} className="border-b border-[#d8e2e8] pb-4 text-[15px] leading-7 md:text-lg">
              {block}
            </p>
          )
        }

        return (
          <p key={block} className="whitespace-pre-line">
            {block}
          </p>
        )
      })}
    </div>
  )
}

function ProductImage({ product }: { product: Product }) {
  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-lg border border-[#d8e2e8] bg-[#eef3f6]">
      <Image src="/lab-products-hero.png" alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 360px" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2d4e93]/35 via-white/10 to-white/20" />
      <div className="absolute bottom-4 left-4 grid h-14 w-14 place-items-center rounded-lg border border-white/70 bg-[#2d4e93] text-lg font-black text-white">
        {initials(product.name)}
      </div>
    </div>
  )
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: (product: Product) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex min-h-[470px] flex-col overflow-hidden rounded-lg border border-[#d8e2e8] bg-white text-left transition hover:-translate-y-1 hover:border-[#b9cbd7] hover:shadow-[0_22px_60px_rgba(26,44,58,0.12)]"
    >
      <ProductImage product={product} />
      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-[#e7eef7] px-3 py-1.5 text-xs font-black uppercase text-[#2d4e93]">
          {product.badge}
        </span>
        <h3 className="mt-4 font-heading text-[22px] font-black leading-tight text-[#1c2b34]">{displayName(product)}</h3>
        <p className="mt-2 text-3xl font-black text-[#929ba2]">{product.price}</p>
        <p className="mt-4 text-[15px] leading-7 text-[#3d4146]">{shortCopy(product.brief)}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-black uppercase text-[#2d4e93]">
          View details
          <Search className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}

export function ProductStore() {
  const detailRef = useRef<HTMLElement | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => products.find((product) => product.name.includes("Wolverine")) ?? products[0])
  const [activeTab, setActiveTab] = useState<ProductTab>("description")
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(0)

  const featuredProducts = useMemo(() => products.filter((product) => product.featured), [])
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)),
    [],
  )

  function selectProduct(product: Product) {
    setSelectedProduct(product)
    setActiveTab("description")
    setQuantity(1)
    requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }

  return (
    <main className="min-h-screen bg-white text-[#1c2b34]">
      <header className="sticky top-0 z-40 border-b border-[#d8e2e8] bg-white/95 backdrop-blur">
        <div className="flex justify-center gap-6 overflow-x-auto bg-[#eef3f6] px-4 py-2 text-xs font-black uppercase text-[#69737b] md:gap-16">
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <ShieldCheck className="h-4 w-4 text-[#2d4e93]" aria-hidden="true" />
            Third-party tested
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <Truck className="h-4 w-4 text-[#2d4e93]" aria-hidden="true" />
            Fast shipping
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <FileText className="h-4 w-4 text-[#2d4e93]" aria-hidden="true" />
            Research use only
          </span>
        </div>
        <nav className="mx-auto flex min-h-[74px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-6">
          <a href="#home" className="inline-flex items-center gap-3 font-heading text-xl font-black text-[#2d4e93]">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#2d4e93] text-white">A</span>
            ARKLABS
          </a>
          <div className="hidden items-center gap-8 font-black text-[#5d6770] md:flex">
            <a href="#catalog" className="hover:text-[#2d4e93]">
              Shop
            </a>
            <a href="#research" className="hover:text-[#2d4e93]">
              Research
            </a>
            <a href="#support" className="hover:text-[#2d4e93]">
              Support
            </a>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2d4e93] px-4 font-black text-white transition hover:bg-[#203f7c]"
            aria-label="View cart"
          >
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1 text-xs text-[#2d4e93]">{cartCount}</span>
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </header>

      <section id="home" className="relative isolate min-h-[calc(100vh-112px)] overflow-hidden">
        <Image src="/lab-products-hero.png" alt="" fill priority className="object-cover object-right" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/15" />
        <div className="relative mx-auto flex min-h-[calc(100vh-112px)] w-[min(1180px,calc(100%-32px))] flex-col justify-center py-16">
          <p className="text-sm font-black uppercase tracking-normal text-[#2d4e93]">Research-grade peptides</p>
          <h1 className="mt-4 max-w-3xl font-heading text-[54px] font-black leading-[0.92] tracking-normal text-[#1c2b34] md:text-[92px]">
            ARK Labs
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#3d4146] md:text-2xl md:leading-10">
            A clean peptide catalog built around product descriptions, research references, third-party documentation, and fast checkout flow.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#catalog"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#2d4e93] px-7 font-black text-white transition hover:bg-[#203f7c]"
            >
              Shop catalog
            </a>
            <button
              type="button"
              onClick={() => selectProduct(selectedProduct)}
              className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[#2d4e93] bg-white px-7 font-black text-[#2d4e93] transition hover:bg-[#eef3f6]"
            >
              View product
            </button>
          </div>
          <p className="mt-auto pt-10 text-sm font-black uppercase text-[#7d858c]">Featured blends below</p>
        </div>
      </section>

      <section className="bg-[#f7fafb] py-16 md:py-24" aria-labelledby="featured-title">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-[#2d4e93]">Featured</p>
              <h2 id="featured-title" className="mt-2 font-heading text-4xl font-black text-[#1c2b34] md:text-6xl">
                Popular Products
              </h2>
            </div>
            <p className="max-w-lg leading-7 text-[#5d6770]">
              The homepage keeps the product-first cadence from your screenshot, with price, brief copy, stock cues, and research documentation nearby.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={selectProduct} />
            ))}
          </div>
        </div>
      </section>

      <section ref={detailRef} className="scroll-mt-28 py-16 md:py-24" aria-label={`${displayName(selectedProduct)} details`}>
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[#d8e2e8] bg-[#eef3f6] md:min-h-[580px]">
              <Image src="/lab-products-hero.png" alt={`${displayName(selectedProduct)} product display`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 520px" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d4e93]/25 via-white/10 to-white/20" />
            </div>
            <div className="mt-4 grid gap-3">
              {["COA", "QC"].map((label) => (
                <div key={label} className="grid min-h-20 grid-cols-[52px_1fr_44px] items-center gap-4 rounded-lg border border-[#d8e2e8] bg-white p-4">
                  <span className="grid h-12 place-items-center rounded-lg bg-[#2d4e93] font-black text-white">{label}</span>
                  <div>
                    <p className="font-black text-[#1c2b34]">
                      {label}-{selectedProduct.id.toUpperCase().slice(0, 18)}
                    </p>
                    <p className="font-black text-[#90999f]">{label === "COA" ? "233 KB" : "198 KB"}</p>
                  </div>
                  <FileSearch className="h-8 w-8 rounded-full border-2 border-[#c5cbd0] p-1 text-[#8e969c]" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-normal text-[#2d4e93]">ARKLABS</p>
            <h2 className="mt-5 font-heading text-[44px] font-black uppercase leading-[0.98] text-[#1c2b34] md:text-[72px]">
              {displayName(selectedProduct)}
            </h2>
            <p className="mt-7 text-[44px] font-black text-[#929ba2] md:text-[64px]">{selectedProduct.price}</p>
            <p className="mt-7 text-xl leading-9 text-[#3d4146] md:text-[28px] md:leading-[1.55]">{selectedProduct.brief}</p>
            <p className="mt-10 text-2xl font-black text-[#8b9300]">{selectedProduct.stock}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1.15fr]">
              <div className="grid min-h-16 grid-cols-[56px_1fr_56px] items-center rounded-full border-2 border-[#2d4e93] text-center text-3xl font-black text-[#2d4e93]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="grid h-full place-items-center"
                >
                  <Minus className="h-7 w-7" aria-hidden="true" />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="grid h-full place-items-center"
                >
                  <Plus className="h-7 w-7" aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setCartCount((value) => value + quantity)}
                className="inline-flex min-h-16 items-center justify-center rounded-full bg-[#2d4e93] px-8 text-xl font-black uppercase text-white transition hover:bg-[#203f7c]"
              >
                Add to cart
              </button>
            </div>
            <p className="mt-4 text-sm font-black uppercase text-[#2d4e93]">
              Line total {formatCurrency(parsePrice(selectedProduct.price) * quantity)}
            </p>
            <div className="mt-9 grid gap-5">
              {[
                ["30", "Money Back Guarantee"],
                ["100%", "Satisfaction Guarantee"],
                ["QC", "Third-Party Tested"],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-5 text-2xl font-black uppercase text-[#6e747a] md:text-4xl">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border-2 border-[#2d4e93] text-sm text-[#2d4e93]">
                    {icon}
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 w-[min(1180px,calc(100%-32px))] rounded-lg border border-[#d8e2e8] bg-white p-3 md:p-8">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#dfe8ed] p-3">
            {(["description", "research"] as ProductTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={`min-h-16 rounded-lg text-xl font-black capitalize transition md:min-h-20 md:text-3xl ${
                  activeTab === tab ? "bg-white text-[#1c2b34] shadow-sm" : "text-[#7d888f]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="px-2 py-10 md:px-0">
            <h2 className="mb-8 font-heading text-[44px] font-black capitalize leading-none text-[#1c2b34] md:text-[76px]">
              {activeTab}
            </h2>
            <CopyBlock text={activeTab === "description" ? selectedProduct.description : selectedProduct.research} tab={activeTab} />
          </div>
        </div>
      </section>

      <section id="catalog" className="bg-[#f7fafb] py-16 md:py-24" aria-labelledby="catalog-title">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-[#2d4e93]">Catalog</p>
              <h2 id="catalog-title" className="mt-2 font-heading text-4xl font-black text-[#1c2b34] md:text-6xl">
                Research Peptides
              </h2>
            </div>
            <p className="max-w-lg leading-7 text-[#5d6770]">
              {products.length} products imported from the spreadsheet, each with separate Description and Research content.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={selectProduct} />
            ))}
          </div>
        </div>
      </section>

      <section id="research" className="bg-[#f5f7f2] py-16 md:py-24">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#2d4e93]">Documentation</p>
            <h2 className="mt-3 font-heading text-4xl font-black leading-tight text-[#1c2b34] md:text-6xl">
              Description and research stay separate.
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              ["Brief Copy", "Displayed directly under the product name and price, matching the product-page rhythm from the screenshot."],
              ["Description Tab", "Long-form product description, properties, vial size, and research-use language stay in their own panel."],
              ["Research Tab", "Study summaries and references can be reviewed without mixing them into the sales copy."],
            ].map(([title, copy]) => (
              <div key={title} className="border-l-4 border-[#2d4e93] bg-white p-6">
                <h3 className="font-heading text-xl font-black text-[#1c2b34]">{title}</h3>
                <p className="mt-2 leading-7 text-[#5d6770]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="support" className="py-16 md:py-24">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 md:grid-cols-3">
          {[
            ["Money Back Guarantee", "Purchase confidence messaging sits near the add-to-cart area."],
            ["Fast Shipping", "The trust strip keeps fulfillment visible from the first viewport."],
            ["Third-Party Tested", "COA and QC document blocks appear alongside each selected product."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-[#d8e2e8] bg-white p-7">
              <h3 className="font-heading text-2xl font-black text-[#1c2b34]">{title}</h3>
              <p className="mt-3 leading-7 text-[#5d6770]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#101820] py-10 text-[#d8dee3]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <p className="text-sm leading-7">{siteDisclaimer}</p>
        </div>
      </footer>

      <div className="fixed bottom-6 right-5 z-50 h-24 w-24 md:bottom-9 md:right-10" aria-label="Quick actions">
        <button
          type="button"
          className="absolute bottom-0 right-0 grid h-20 w-20 place-items-center rounded-full bg-[#2d4e93] text-white shadow-[0_14px_30px_rgba(25,56,118,0.28)]"
          aria-label="Open live chat"
        >
          <MessageCircle className="h-9 w-9" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="absolute right-0 top-0 grid h-14 w-14 place-items-center rounded-full border-[7px] border-[#35404a] bg-[#ef3f3f] text-white"
          aria-label="Product notice"
        >
          <AlertCircle className="h-8 w-8" aria-hidden="true" />
        </button>
      </div>
    </main>
  )
}
