"use client";

import { useEffect, useState } from "react";

/** Browser connectivity is a hint, not proof that the server is reachable. */
export function ConnectionNotice() {
  const [connection, setConnection] = useState<"normal" | "offline" | "restored">("normal");
  useEffect(() => {
    const offline = () => setConnection("offline");
    const online = () => setConnection(current => current === "offline" ? "restored" : current);
    if (!navigator.onLine) offline();
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    return () => { window.removeEventListener("offline", offline); window.removeEventListener("online", online); };
  }, []);
  if (connection === "normal") return null;
  return <aside aria-label="Connection status" className="mx-auto w-full max-w-[390px] border-b border-muted bg-paper px-4 py-3 text-sm text-forest">
    <p role="status">{connection === "offline"
      ? "Your browser reports that you are offline. Keep this page open and copy important text before leaving. Photos and submissions need a connection; nothing will be submitted automatically when it returns."
      : "Your browser reports that the connection has returned. Check the latest saved job status before repeating a submission or test payment. This does not confirm the server is reachable."}</p>
    {connection === "restored" && <button type="button" className="mt-2 min-h-11 underline" onClick={() => setConnection("normal")}>Dismiss connection message</button>}
  </aside>;
}
