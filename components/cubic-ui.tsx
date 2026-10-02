"use client";
import {useEffect,useState} from "react";
import {Cpu,Code2,Layers,Sun,Moon} from "lucide-react";
import {useTheme} from "next-themes";
import type {Robot} from "@/lib/content";
export function Logo({showText=true}:{showText?:boolean}){return <a className="brand" href="/" aria-label="Cubic home"><img className="brand-logo logo-dark" src="/logo-dark.svg" alt="" width={58} height={45}/><img className="brand-logo logo-light" src="/logo-light.svg" alt="" width={58} height={45}/>{showText&&"cubic"}</a>}
function ThemeToggle(){const {resolvedTheme,setTheme}=useTheme();const [mounted,setMounted]=useState(false);useEffect(()=>setMounted(true),[]);const dark=mounted&&resolvedTheme==="dark";return <button type="button" className="theme-toggle" aria-label={dark?"Switch to light theme":"Switch to dark theme"} title={dark?"Light theme":"Dark theme"} disabled={!mounted} onClick={()=>setTheme(dark?"light":"dark")}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button>}
export function Header(){return <header className="site-header"><Logo showText={false}/><nav aria-label="Main navigation"><a href="/#robots">Our robots</a><a href="/#team">The team</a><ThemeToggle/></nav></header>}
export function Footer(){return <footer className="wrap"><Logo/><span>Built with curiosity. Powered by teamwork.</span><a href="/admin">Team admin</a></footer>}
export function Photo({src,alt,className=""}:{src:string;alt:string;className?:string}){const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src]);return src&&!failed?<img className={className} src={src} alt={alt} loading="lazy" onError={()=>setFailed(true)}/>:null}
export function Specs({robot}:{robot:Robot}){return <div className="spec-grid">{[[Cpu,"DIMENSIONS",robot.dimensions],[Code2,"PROGRAMMING",robot.programming],[Layers,"MATERIALS",robot.materials]].map(([Icon,label,value])=>{const I=Icon as typeof Cpu;return value?<div key={label as string}><I/>{label as string}<strong>{value as string}</strong></div>:null})}</div>}
