"use client";
import {createContext,useContext,useEffect,useState,useCallback,type ReactNode} from "react";
import {initializeApp,getApps,type FirebaseOptions} from "firebase/app";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut,type Auth,type User} from "firebase/auth";
import {getDatabase,ref,onValue,push,set,remove,type Database} from "firebase/database";
import {memberSchema,robotSchema,type Member,type Robot} from "@/lib/content";
type Mode="loading"|"live"|"error";
type Store={members:Member[];robots:Robot[];mode:Mode;error:string;user:User|null;isAdmin:boolean;authReady:boolean;login:(email:string,password:string)=>Promise<void>;logout:()=>Promise<void>;save:(kind:"members"|"robots",value:unknown,id?:string)=>Promise<void>;erase:(kind:"members"|"robots",id:string)=>Promise<void>};
const Context=createContext<Store|null>(null);
export function CubicData({children}:{children:ReactNode}){
 const [members,setMembers]=useState<Member[]>([]),[robots,setRobots]=useState<Robot[]>([]),[mode,setMode]=useState<Mode>("loading"),[error,setError]=useState(""),[user,setUser]=useState<User|null>(null),[isAdmin,setAdmin]=useState(false),[authReady,setAuthReady]=useState(false),[services,setServices]=useState<{auth:Auth;db:Database}|null>(null);
 useEffect(()=>{let active=true;const stops:(()=>void)[]=[];let stopAdmin=()=>{};
 async function boot(){try{const response=await fetch("/firebase-config.json",{cache:"no-store"});if(!response.ok)throw Error("Could not load the Firebase configuration.");const config:FirebaseOptions=await response.json();if(!config.apiKey||!config.databaseURL||!config.projectId||!config.authDomain)throw Error("Firebase configuration is incomplete. Check apiKey, databaseURL, projectId and authDomain.");
 const app=getApps().find(a=>a.name==="cubic")??initializeApp(config,"cubic");const auth=getAuth(app),db=getDatabase(app);if(!active)return;setMembers([]);setRobots([]);setServices({auth,db});let ready=0;let failed=false;
 const fail=(e:Error)=>{if(active){failed=true;setError(e.message);setMode("error");}};
 stops.push(onValue(ref(db,"cubic/members"),snap=>{try{const rows=Object.entries(snap.val()??{}).map(([id,v])=>({...memberSchema.parse(v),id})).sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name));if(active){setMembers(rows);ready|=1;if(ready===3&&!failed)setMode("live");}}catch{fail(Error("Some member data has an invalid format. Check the database records."));}},fail));
 stops.push(onValue(ref(db,"cubic/robots"),snap=>{try{const rows=Object.entries(snap.val()??{}).map(([id,v])=>({...robotSchema.parse({...v as object,specs:(v as {specs?:unknown}).specs??[]}),id})).sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name));if(active){setRobots(rows);ready|=2;if(ready===3&&!failed)setMode("live");}}catch{fail(Error("Some robot data has an invalid format. Check the database records."));}},fail));
 stops.push(onAuthStateChanged(auth,u=>{stopAdmin();setUser(u);setAdmin(false);setAuthReady(!u);if(u){stopAdmin=onValue(ref(db,`admins/${u.uid}`),s=>{setAdmin(s.val()===true);setAuthReady(true);},()=>{setAdmin(false);setAuthReady(true);});}}));
 }catch(e){if(active){setMode("error");setError(e instanceof Error?e.message:"Unable to connect.");setAuthReady(true);}}}void boot();return()=>{active=false;stops.forEach(s=>s());stopAdmin();};},[]);
 const save=useCallback(async(kind:"members"|"robots",value:unknown,id?:string)=>{if(!services||!isAdmin)throw Error("Connect Firebase and sign in as an approved administrator to save.");if(id&&!/^[A-Za-z0-9_-]+$/.test(id))throw Error("Invalid record ID.");const data=(kind==="members"?memberSchema:robotSchema).parse(value);const target=id?ref(services.db,`cubic/${kind}/${id}`):push(ref(services.db,`cubic/${kind}`));await set(target,data);},[services,isAdmin]);
 const erase=useCallback(async(kind:"members"|"robots",id:string)=>{if(!services||!isAdmin)throw Error("Administrator access is required.");if(!/^[A-Za-z0-9_-]+$/.test(id))throw Error("Invalid record ID.");await remove(ref(services.db,`cubic/${kind}/${id}`));},[services,isAdmin]);
 return <Context.Provider value={{members,robots,mode,error,user,isAdmin,authReady,save,erase,login:async(email,password)=>{if(!services)throw Error("Firebase is not connected.");await signInWithEmailAndPassword(services.auth,email,password);},logout:async()=>{if(services)await signOut(services.auth);}}}>{children}</Context.Provider>;
}
export function useCubic(){const value=useContext(Context);if(!value)throw Error("Missing CubicData provider");return value;}
