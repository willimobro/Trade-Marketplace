/* Run against a locally seeded disposable runtime only.
   QA_BASE_URL=http://127.0.0.1:3133 QA_DB=/.../trade-brand-fix-qa-.../qa.db
   QA_ALLOW_TEMP_DB_MUTATION=1 PLAYWRIGHT_MODULE=/path/to/playwright node this-file
   Optional CHROMIUM_EXECUTABLE points to an installed browser. No installation required. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const loadModule = createRequire(import.meta.url);
const { chromium } = loadModule(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:3133');
assert.ok(['127.0.0.1', 'localhost'].includes(base.hostname), 'Local disposable runtime only');
const db = fs.realpathSync(process.env.QA_DB);
assert.equal(process.env.QA_ALLOW_TEMP_DB_MUTATION, '1');
assert.ok(db.includes('/trade-brand-fix-qa-') && db.endsWith('/qa.db'), 'Refuse non-test database');
const sql = statement => execFileSync('python3', ['-c', 'import sqlite3,sys\nwith sqlite3.connect(sys.argv[1]) as db:\n c=db.execute(sys.argv[2]); print(c.fetchall())', db, statement], { encoding: 'utf8' }).trim();
(async () => {
  const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_EXECUTABLE ? {executablePath:process.env.CHROMIUM_EXECUTABLE} : {})});
  let unavailable = false;
  try {
    const page = await browser.newPage({viewport:{width:390,height:844}});
    await page.goto(new URL('/demo', base).href);
    await page.getByRole('button', {name:'Open customer demo',exact:true}).click();
    await page.waitForURL('**/dashboard');
    const route = new URL('/receipts/demo-job-1005', base).href;
    await page.goto(route);
    await page.getByRole('heading',{name:'Payment record',exact:true}).waitFor();
    const rowsBefore = sql('SELECT count(*), sum(amountCents) FROM Payment');
    sql('ALTER TABLE Payment RENAME TO QaPaymentUnavailable'); unavailable = true;
    try {
      await page.reload();
      await page.getByRole('heading',{name:'We couldn’t load the payment record',exact:true}).waitFor();
    } finally {
      sql('ALTER TABLE QaPaymentUnavailable RENAME TO Payment'); unavailable = false;
    }
    const styles = await page.locator('.btn-primary,.btn-ghost').evaluateAll(nodes => nodes.map(el => ({tag:el.tagName,size:getComputedStyle(el).fontSize,weight:getComputedStyle(el).fontWeight,leading:getComputedStyle(el).lineHeight})));
    assert.ok(styles.some(s=>s.tag==='BUTTON') && styles.some(s=>s.tag==='A'));
    for (const style of styles) assert.deepEqual([style.size,style.weight,style.leading],['14px','700','16.8px']);
    const response = page.waitForResponse(r => r.url()===route && r.request().isNavigationRequest());
    await page.getByRole('button',{name:'Reload payment record',exact:true}).press('Enter');
    assert.equal((await response).status(),200);
    await page.getByRole('heading',{name:'Payment record',exact:true}).waitFor();
    assert.equal(await page.getByRole('heading',{name:'We couldn’t load the payment record',exact:true}).count(),0);
    assert.equal(await page.getByText('Net recorded payments',{exact:true}).count(),1);
    assert.equal(sql('SELECT count(*), sum(amountCents) FROM Payment'),rowsBefore,'Retry must not create payments');
    console.log(JSON.stringify({receiptRetry:'fresh navigation recovered saved data',styles,paymentRecords:'unchanged'},null,2));
  } finally {
    if (unavailable) sql('ALTER TABLE QaPaymentUnavailable RENAME TO Payment');
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
