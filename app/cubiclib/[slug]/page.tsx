import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Documentation } from "@/components/cubiclib-documentation";
import { cubicDocs } from "@/lib/cubiclib-docs";
export const dynamicParams = false;
export function generateStaticParams() { return cubicDocs.filter(page => page.slug !== "overview").map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = cubicDocs.find(page => page.slug === slug);
  return { title: page ? `${page.title} — CubicLib` : "CubicLib", description: page?.description };
}
export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!cubicDocs.some(page => page.slug === slug)) notFound();
  return <Documentation slug={slug}/>;
}
