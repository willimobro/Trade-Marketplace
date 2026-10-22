# Preview role redirect and Customer ETA cleanup

Base/live version: `0eab99dffaf4420636f1d10f09a64635913f2bdb`. This is a separate review candidate; it has not been deployed.

## Confirmed cause

Next 15.5.28's installed `server/next-server.js` builds `initURL` from its configured listener host/port and `x-forwarded-proto`. `server/app-render/action-handler.js:createRedirectRenderResult` then uses that URL to fetch a server-action redirect destination. The preview's internal listener is HTTP, while Render's TLS-terminating ingress forwards HTTPS. The optimization consequently attempts TLS against the HTTP listener. Its catch logs `failed to get redirect response`; the subsequent browser redirect still succeeds.

A disposable loopback proxy reproduced the failure before the patch by forwarding `x-forwarded-proto: https` to the unmodified HTTP preview server. The baseline recorded one redirect-fetch/TLS error and a 303 role-action response. The local TLS library reported `ERR_SSL_PACKET_LENGTH_TOO_LONG`, while Render reported `ERR_SSL_WRONG_VERSION_NUMBER`; both traces originate at the same redirect self-fetch and plaintext/TLS mismatch.

## Scoped correction

- Password verification and ordinary signed-session creation live in the shared server-only `createPasswordSession` helper. Normal login keeps its existing normalization, errors and `safeNext` redirect. Signup/logout behavior is unchanged.
- The protected preview action retains the boot-identity guard, fixed three-account mapping and actual password verification. It returns only the fixed destination after success, never credentials or a client-supplied redirect.
- The role picker keeps the Server Action and its framework origin checks, but navigates with `window.location.assign` after a successful result. Only `/dashboard` and `/admin` are accepted. A success destination is not retained, so Back does not replay navigation and successive roles can share `/dashboard`.
- Customer cards say `Quote ETA`; the guarded fixture lookup and displayed values are unchanged. Customer posting handoff copy no longer calls the account/job a sample, while retaining the device-only/no-delivery truth.

No TLS options, certificate validation, provider configuration, secrets, permissions, startup gate, database model or payment behavior changed. This fixes the observed preview-picker path, not every unrelated Server Action redirect in the application.

## Verification

- Production `preview:build` passes with lint/type validation.
- 138 application tests and 8 preview-security tests pass. Six added authentication tests cover real bcrypt acceptance/rejection, ordinary login compatibility, invalid roles, absent boot access, missing preview credentials, bounded destinations and repeat client success handling. Signup tests remain green.
- Browser proxy regression at 390/1440: Tradie → Customer → Tradie → Administrator → Customer, with Back/Forward around each switch. All ten assertions passed with the expected actual account headings and usable picker controls.
- The fixed runtime recorded 12 successful role POSTs, all status 200 with no server-action redirect header, and zero redirect-fetch/TLS errors. Native browser document navigation opened each destination.
- Eight rendered Customer ETA labels read exactly `Quote ETA`. Necessary preview/payment disclosures remain.
- Direct anonymous upstream probes returned health 200 and preview 401. Test data/uploads were created by the existing disposable startup script; no user database/uploads or live service was modified.

Evidence: `task/evidence/role-redirect/comparison.json`, `before/runtime.log`, `after/runtime.log`, `after/proxy.jsonl`, `after/browser-results.json` and `after/customer-eta-390.png`.

## Focused independent recheck

Use `tests/browser/preview-role-proxy.mjs <checkout> <new-evidence-directory>` with Node 22 after building. It launches the protected synthetic server on loopback port 45147 and the forwarded-HTTPS-header proxy on loopback port 45148. Its disposable test credentials never leave loopback and are not production credentials. Run `verifyPreviewRoleRedirect` from `tests/browser/preview-role-redirect.cua.js` through the supported browser against `/preview`; compare role POSTs and runtime errors. Stop the harness when finished.

Review the shared authentication helper and normal-login compatibility tests as well as the role picker. No broad visual re-audit or deployment is requested at this checkpoint.
