"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Copy, Download, Search } from "lucide-react";
import { Header } from "@/components/cubic-ui";
import { cubicDocs } from "@/lib/cubiclib-docs";

export function docHref(slug: string) { return slug === "overview" ? "/cubiclib/" : `/cubiclib/${slug}/`; }

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [status, setStatus] = useState("Copy");
  async function copy() {
    try { await navigator.clipboard.writeText(code); setStatus("Copied"); }
    catch { setStatus("Select code to copy"); }
    window.setTimeout(() => setStatus("Copy"), 2500);
  }
  return <div className="docs-code"><div className="docs-code-label"><span>{language || "Code"}</span><button onClick={copy} type="button" aria-label="Copy code">{status === "Copied" ? <Check size={14}/> : <Copy size={14}/>}<span aria-live="polite">{status}</span></button></div><pre tabIndex={0}><code>{code}</code></pre></div>;
}

export function Documentation({ slug }: { slug: string }) {
  const [query, setQuery] = useState("");
  const page = cubicDocs.find(doc => doc.slug === slug)!;
  const index = cubicDocs.indexOf(page);
  const groups = [...new Set(cubicDocs.map(doc => doc.group))];
  const search = query.trim().toLowerCase();
  const matches = cubicDocs.filter(doc => [doc.title, doc.description, ...doc.sections.flatMap(section => [section.title, ...section.text, section.code || ""])].join(" ").toLowerCase().includes(search));
  return <><Header/><a href="#docs-content" className="docs-skip">Skip to documentation</a><div className="docs-shell">
    <aside className="docs-sidebar"><Link href="/cubiclib/" className="docs-brand"><BookOpen size={21}/><strong>CubicLib</strong><span>0.2.0-dev</span></Link><label className="docs-search"><Search size={16}/><input type="search" aria-label="Search documentation" placeholder="Search docs…" value={query} onChange={event => setQuery(event.target.value)}/></label>
      <nav aria-label="Documentation">{groups.map(group => {const pages = matches.filter(doc => doc.group === group); return pages.length > 0 && <div className="docs-nav-group" key={group}><h2>{group}</h2>{pages.map(doc => <Link href={docHref(doc.slug)} key={doc.slug} aria-current={doc.slug === slug ? "page" : undefined}>{doc.title}</Link>)}</div>;})}{matches.length === 0 && <p className="docs-no-results" role="status">No pages found. Try “pods”, “heading” or “install”.</p>}</nav>
      <a className="docs-source" href="https://github.com/Cubic25473/CubicLib">View source on GitHub ↗</a>
    </aside>
    <main className="docs-article" id="docs-content"><div className="docs-breadcrumb">Documentation <span>/</span> {page.group}</div><h1>{page.title}</h1><p className="docs-description">{page.description}</p>
      {page.slug === "overview" && <div className="docs-start"><Link href="/cubiclib/installation/">Install CubicLib <ArrowRight size={17}/></Link><Link href="/cubiclib/first-teleop/">View TeleOp example</Link></div>}
      <nav className="docs-mobile-toc" aria-label="Page sections"><details><summary>On this page</summary>{page.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</details></nav>
      {page.sections.map(section => <section className="docs-section" id={section.id} key={section.id}><h2><a href={`#${section.id}`}>{section.title}<span aria-hidden="true"> #</span></a></h2>{section.text.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.code && <CodeBlock code={section.code} language={section.language}/>}</section>)}
      {page.slug === "first-teleop" && <div className="docs-start">{["Intake.java", "SimpleTeleOp.java", "CubicTeleOp.java"].map(name => <a key={name} className="docs-download" href={`/cubiclib/${name}`} download><Download size={17}/> {name}</a>)}</div>}
      <nav className="docs-pagination" aria-label="Adjacent documentation pages">{index > 0 ? <Link href={docHref(cubicDocs[index - 1].slug)}><small><ArrowLeft size={13}/> Previous</small>{cubicDocs[index - 1].title}</Link> : <span/>}{index < cubicDocs.length - 1 && <Link href={docHref(cubicDocs[index + 1].slug)}><small>Next <ArrowRight size={13}/></small>{cubicDocs[index + 1].title}</Link>}</nav>
    </main>
    <aside className="docs-toc"><nav aria-label="On this page"><h2>On this page</h2>{page.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav><div className="docs-version">CubicLib 0.2.0 preview<br/>FTC SDK 12.0.0</div></aside>
  </div></>;
}
