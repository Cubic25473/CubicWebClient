import type { Metadata } from "next";
import { Documentation } from "@/components/cubiclib-documentation";
export const metadata: Metadata = { title: "CubicLib Documentation", description: "Install and use CubicLib: FTC commands, odometry, Bézier paths and robot performance reports." };
export default function CubicLibPage() { return <Documentation slug="overview"/>; }
