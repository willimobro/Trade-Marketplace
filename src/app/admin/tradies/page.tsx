import styles from "../admin.module.css";
import Link from "next/link";
import { db } from "@/lib/db";
import { setLicence } from "@/app/actions/admin";
import { EWRB_REGISTER_URL, timeAgo } from "@/lib/constants";
import { ConfirmAction } from "../ConfirmAction";
import { LicenceBadge } from "@/components/ui";
import { tradeRequirementsPending } from "@/lib/trade-readiness";

export const dynamic = "force-dynamic";

export default async function AdminTradiesPage() {
  const tradies = await db.user.findMany({
    where: { role: "TRADIE" },
    orderBy: [{ licenceVerified: "asc" }, { createdAt: "desc" }],
    select: {
      id: true, name: true, email: true, phone: true, region: true, trade: true, registrationNo: true, licenceVerified: true, createdAt: true,
      _count: { select: { jobsAssigned: true } },
    },
  });
  return (
    <div>
      <h1 className="text-3xl font-bold sm:text-4xl">Trade verification</h1>
      <p className="mt-3 font-medium">{tradies.filter((t) => !tradeRequirementsPending(t.trade) && !t.licenceVerified).length} electricians awaiting verification · {tradies.filter((t) => tradeRequirementsPending(t.trade)).length} accounts awaiting trade requirements · {tradies.length} registered</p>
      <p className="mt-1 text-sm text-muted">
        For electrical accounts only, check the registration number on the <a href={EWRB_REGISTER_URL} target="_blank" rel="noreferrer" className="underline">EWRB public register</a> (current practising licence, right class) before verifying. Other trades’ verification and completion requirements are not configured.
      </p>
      <aside className="mt-6 rounded-2xl border border-black/15 bg-paper p-4 text-sm">
        <h2 className="font-semibold">Verification record limitations</h2>
        <p className="mt-2 text-muted">This prototype stores verified or unverified status only. It does not store a review reason, reviewer history, licence expiry date or scheduled re-check. A verified badge is not evidence of a current automated register check.</p>
      </aside>
      <div className="mt-6 grid gap-4">
        {tradies.map((t) => (
          <div key={t.id} className={`card flex flex-wrap items-start gap-4 text-sm ${styles.record} ${styles.verificationRecord}`}>
            <div className={styles.person}>
              <Link href={`/tradies/${t.id}`} className="font-semibold hover:underline">{t.name}</Link>
              <p className="text-xs text-muted">{t.email} · {t.phone ?? "no phone"} · {t.region} · joined {timeAgo(t.createdAt)} · {t._count.jobsAssigned} jobs</p>
            </div>
            <p className={`text-muted ${styles.registration}`}>Trade: {t.trade || "Not supplied"} · Registration <span className={`font-mono text-ink ${styles.breakText}`}>{t.registrationNo || "Not supplied"}</span></p>
            {tradeRequirementsPending(t.trade) ? <p className="w-full rounded-xl bg-amber-50 p-3 text-amber-950">Verification and completion requirements are pending for this trade. Estimating, claiming and electrical CoC completion are unavailable. {t.licenceVerified && "An existing verified flag does not establish eligibility and can be removed below."}</p> : <LicenceBadge verified={t.licenceVerified} />}
            {!tradeRequirementsPending(t.trade) && <details className="w-full rounded-xl border border-black/10 p-3">
              <summary className="cursor-pointer py-2 font-medium">Review checklist & record coverage</summary>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
                <li>Match the registration number and identity against the external register.</li>
                <li>Check the practising licence and class for the work being offered.</li>
                <li>Review reason and history: unavailable in this prototype.</li>
                <li>Licence expiry and reminders: not recorded; check the register directly.</li>
              </ul>
              <p className="mt-3 text-muted">No review notes or dates are saved by this screen. Keep any required evidence in your existing review process.</p>
            </details>}
            {(!tradeRequirementsPending(t.trade) || t.licenceVerified) && <ConfirmAction
              action={setLicence.bind(null, t.id, !t.licenceVerified)}
              label={t.licenceVerified ? "Review verification removal" : "Review verification"}
              description={t.licenceVerified ? `Remove the existing verified flag from ${t.name}? They will not have verified eligibility until their trade requirements are configured and checked.` : `Confirm you have checked ${t.name} against the EWRB register, including the current practising licence and appropriate class. This updates the verified flag only; it does not save review evidence or an expiry date.`}
              confirmLabel={t.licenceVerified ? "Remove verified status" : "Confirm verified status"}
              destructive={t.licenceVerified}
            />}
          </div>
        ))}
        {!tradies.length && <p className="p-4 text-sm text-muted">No tradies yet.</p>}
      </div>
    </div>
  );
}
