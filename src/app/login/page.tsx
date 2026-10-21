import Image from "next/image";
import Link from "next/link";
import { SourceIcon } from "@/components/SourceIcon";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./LoginForm";
import styles from "./login.module.css";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { next } = await searchParams;
  return <div className={styles.screen}>
    <Image src="/original/login-bolt.svg" alt="" width={419} height={694} className={`${styles.art} ${styles.bolt}`} unoptimized />
    <Image src="/original/login-panel.svg" alt="" width={390} height={530} className={`${styles.art} ${styles.panel}`} unoptimized />
    <Image src="/original/login-mark.svg" alt="" width={26} height={43} className={`${styles.art} ${styles.mark}`} unoptimized />
    <Image src="/original/login-illustration.png" alt="" width={282} height={281} className={`${styles.art} ${styles.illustration}`} priority unoptimized />
    <Link href="/" aria-label="Back to home" className={styles.back}><SourceIcon name="back" size={39} style={{ padding: 6.5, color: "white" }} /></Link>
    <h1 className={styles.title} aria-label="Welcome Back"><svg width="302" height="155" aria-hidden="true"><text x="0 41.66015625 67.359375 77.4140625 102.796875 129.234375 168.78515625" y="34.296875">Welcome</text><text x="0 29.91796875 55.08984375 80.47265625" y="77.296875">Back</text></svg></h1>
    <LoginForm next={next} />
  </div>;
}
