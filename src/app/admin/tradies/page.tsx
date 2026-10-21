import Link from "next/link";
import { db } from "@/lib/db";
import { setLicence } from "@/app/actions/admin";
import { EWRB_REGISTER_URL, timeAgo } from "@/lib/constants";
import { ConfirmAction } from "../ConfirmAction";
import { LicenceBadge } from "@/components/ui";

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
      <h1 className="text-3xl font-bold sm:text-4xl">Electrician verification</h1>
      <p className="mt-3 font-medium">{tradies.filter((t) => !t.licenceVerified).length} awaiting verification · {tradies.length} registered</p>
      <p className="mt-1 text-sm text-muted">
        Check each registration number on the <a href={EWRB_REGISTER_URL} target="_blank" rel="noreferrer" className="underline">EWRB public register</a> (current practising licence, right class) before verifying.
      </p>
      <div className="mt-6 grid gap-4">
        {tradies.map((t) => (
          <div key={t.id} className="card flex flex-wrap items-center gap-4 p-4 text-sm sm:p-6">
            <div className="min-w-[min(100%,240px)] flex-1 break-words">
              <Link href={`/tradies/${t.id}`} className="font-semibold hover:underline">{t.name}</Link>
              <p className="text-xs text-muted">{t.email} · {t.phone ?? "no phone"} · {t.region} · joined {timeAgo(t.createdAt)} · {t._count.jobsAssigned} jobs</p>
            </div>
            <p className="text-muted">Registration <span className="font-mono text-ink">{t.registrationNo || "Not supplied"}</span></p>
            <LicenceBadge verified={t.licenceVerified} />
            <ConfirmAction
              action={setLicence.bind(null, t.id, !t.licenceVerified)}
              label={t.licenceVerified ? "Review verification removal" : "Review verification"}
              description={t.licenceVerified ? `Remove the verified status from ${t.name}? This changes their access to verified-electrician actions.` : `Confirm you have checked ${t.name} against the EWRB register, including the current practising licence and appropriate class. This records your manual check.`}
              confirmLabel={t.licenceVerified ? "Remove verified status" : "Confirm verified status"}
              destructive={t.licenceVerified}
            />
          </div>
        ))}
        {!tradies.length && <p className="p-4 text-sm text-muted">No tradies yet.</p>}
      </div>
    </div>
  );
}
