import Link from "next/link";
import { db } from "@/lib/db";
import { setLicence } from "@/app/actions/admin";
import { EWRB_REGISTER_URL, timeAgo } from "@/lib/constants";
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
      <h1 className="text-2xl font-bold">Tradies</h1>
      <p className="mt-1 text-sm text-muted">
        Check each registration number on the <a href={EWRB_REGISTER_URL} target="_blank" rel="noreferrer" className="underline">EWRB public register</a> (current practising licence, right class) before verifying.
      </p>
      <div className="card mt-6 divide-y divide-black/5">
        {tradies.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center gap-3 p-4 text-sm">
            <div className="min-w-0 flex-1">
              <Link href={`/tradies/${t.id}`} className="font-semibold hover:underline">{t.name}</Link>
              <p className="text-xs text-muted">{t.email} · {t.phone ?? "no phone"} · {t.region} · joined {timeAgo(t.createdAt)} · {t._count.jobsAssigned} jobs</p>
            </div>
            <span className="font-mono">{t.registrationNo}</span>
            <LicenceBadge verified={t.licenceVerified} />
            <form action={setLicence.bind(null, t.id, !t.licenceVerified)}>
              <button className={t.licenceVerified ? "btn-ghost" : "btn-primary"}>{t.licenceVerified ? "Revoke" : "Verify"}</button>
            </form>
          </div>
        ))}
        {!tradies.length && <p className="p-4 text-sm text-muted">No tradies yet.</p>}
      </div>
    </div>
  );
}
