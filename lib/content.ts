import { z } from "zod";
const text = (max: number) => z.string().trim().max(max);
export const imageUrl = text(2000).refine(v => !v || v.startsWith("/") && !v.startsWith("//") || /^https:\/\//i.test(v), "Use an HTTPS image URL.");
export const memberSchema = z.object({name:text(100).min(1,"Enter a name."),role:text(100).min(1,"Enter a role."),bio:text(1500),image:imageUrl,order:z.number().int().min(0).max(9999)});
export const robotSchema = z.object({name:text(100).min(1,"Enter a robot name."),season:text(50),description:text(2000),image:imageUrl,dimensions:text(100),weight:text(100),programming:text(300),materials:text(300),drivetrain:text(200),specs:z.array(z.object({label:text(80).min(1),value:text(300).min(1)})).max(20),featured:z.boolean(),order:z.number().int().min(0).max(9999)});
export type Member = z.infer<typeof memberSchema> & {id:string};
export type Robot = z.infer<typeof robotSchema> & {id:string};
