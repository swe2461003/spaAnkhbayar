import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
const port = 4183;
const processServer = spawn(process.execPath, ['tools/serve.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: 'pipe', windowsHide: true });
await new Promise((resolve, reject) => { processServer.stdout.once('data', resolve); processServer.once('error', reject); processServer.once('exit', code => reject(Error(`Server exited ${code}`))); });
const chromePaths = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].filter(Boolean);
const executablePath = chromePaths.find(existsSync);
let browser;
const results = [];
const errors = [];
await mkdir('test-results', { recursive: true });
try {
  browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(err.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const base = `http://127.0.0.1:${port}/`;
  const check = async (name, fn) => { await fn(); results.push({ name, status: 'passed' }); console.log('PASS', name); };
  const route = async path => { await page.goto(base + '#/' + path); await page.locator('#app .page').waitFor(); await page.locator('#app .page h1').waitFor(); };
  await check('demo login', async () => { await page.goto(base); await page.locator('#login-form').waitFor(); await page.locator('#login-form button').click(); await page.locator('.welcome-card').waitFor(); });
  await check('dashboard uses actual sample data', async () => { assert.equal(await page.locator('.schedule-row').count(), 6); assert.equal(await page.locator('.stat-value').first().innerText(), '12'); });
  await mkdir('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/dashboard.png', fullPage: true });
  await check('search filters and empty state', async () => {
    await route('search'); await page.locator('#filters input').fill('CON354'); assert.equal(await page.locator('#results tbody tr').count(), 1); assert.match(await page.locator('#results').innerText(), /CON354/);
    await page.locator('#filters input').fill('not-existing'); assert.match(await page.locator('#results').innerText(), /Мэдээлэл олдсонгүй/);
    await page.locator('#filters input').fill(''); await page.locator('#filters select[name="department"]').selectOption('systems'); assert.equal(await page.locator('#results tbody tr').count(), 3);
  });
  await check('image modal, Escape and focus return', async () => { await page.locator('[data-image]').first().click(); await page.locator('dialog[open] img').waitFor(); await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog').count(), 0); });
  await check('CSV export downloads filtered rows', async () => { const downloadPromise = page.waitForEvent('download'); await page.locator('#export-courses').click(); const download = await downloadPromise; assert.equal(download.suggestedFilename(), 'courses.csv'); });
  await check('language rerenders data and preserves filters', async () => { await page.locator('#language').click(); await page.locator('h1', { hasText: 'Courses' }).waitFor(); assert.match(await page.locator('#results').innerText(), /Information Systems/); assert.equal(await page.locator('#results tbody tr').count(), 3); assert.equal(await page.locator('html').getAttribute('lang'), 'en'); await page.locator('#language').click(); await page.locator('h1', { hasText: 'Хичээлүүд' }).waitFor(); });
  await check('attendance save and reload', async () => {
    await route('attendance'); await page.locator('#attendance-table select').first().selectOption('late'); await page.locator('#attendance-form button[type="submit"]').click(); await page.locator('#toast.visible').waitFor();
    await page.reload(); await page.locator('#attendance-table select').first().waitFor(); assert.equal(await page.locator('#attendance-table select').first().inputValue(), 'late');
  });
  await check('journal editing, totals and persistence', async () => {
    await route('journal'); await page.locator('[data-component="midterm"]').first().fill('19'); await page.locator('#grades-form button').click(); await page.locator('#toast.visible').waitFor();
    await page.reload(); await page.locator('[data-component="midterm"]').first().waitFor(); assert.equal(await page.locator('[data-component="midterm"]').first().inputValue(), '19');
    await page.locator('#lesson-form [name="topic"]').fill('Test <script>alert(1)</script>'); await page.locator('#lesson-form button').click(); await page.locator('#lessons').getByText('Test <script>alert(1)</script>').waitFor();
  });
  await check('weighted grade calculator', async () => { await route('calculation'); assert.equal(await page.locator('[data-total="CON354"]').innerText(), '84.00'); await page.locator('[data-score="midterm"]').fill('100'); assert.equal(await page.locator('[data-total="CON354"]').innerText(), '88.00'); await page.locator('[data-remove]').click(); assert.equal(await page.locator('#gpa').innerText(), '0.00'); });
  await check('PDF material modal and actual file', async () => { await route('books'); await page.locator('[data-book]').first().click(); await page.locator('dialog iframe').waitFor(); const pdf = await context.request.get(base + 'pdf/con354-lab-guide.pdf'); assert.equal(pdf.status(), 200); assert.equal((await pdf.body()).subarray(0, 4).toString(), '%PDF'); await page.keyboard.press('Escape'); });
  await check('messages persist and escape HTML', async () => { await route('messages'); await page.locator('#message-form input').fill('<img src=x onerror=alert(1)>'); await page.locator('#message-form button').click(); await page.locator('.chat-bubble.mine').waitFor(); assert.equal(await page.locator('.chat-bubble.mine img').count(), 0); await page.reload(); await page.locator('.chat-bubble.mine').waitFor(); });
  await check('anonymous feedback and status update', async () => { await route('feedback'); await page.locator('#feedback-form textarea').fill('Automated anonymous feedback'); await page.locator('#feedback-form button').click(); await page.locator('.feedback-item', { hasText: 'Automated anonymous feedback' }).waitFor(); await page.locator('.feedback-item').first().locator('select').selectOption('resolved'); await page.reload(); await page.locator('.feedback-item select').first().waitFor(); assert.equal(await page.locator('.feedback-item select').first().inputValue(), 'resolved'); });
  await check('logs filter and real pagination controls', async () => {
    await page.evaluate(async () => { const { logAction } = await import('/js/services/logService.js'); for (let i = 0; i < 9; i++) await logAction('create', 'Pagination test ' + i); });
    await route('logs'); assert.equal(await page.locator('#log-table tbody tr').count(), 8); assert.equal(await page.locator('#next').isDisabled(), false); await page.locator('#next').click(); assert.match(await page.locator('#page-number').innerText(), /^2/); await page.locator('#prev').click();
    await page.locator('#log-search').fill('Grades'); assert.match(await page.locator('#log-table').innerText(), /Grades/); await page.locator('#log-search').fill('not-existing'); assert.match(await page.locator('#log-table').innerText(), /Мэдээлэл олдсонгүй/);
  });
  await check('archive tabs and filters', async () => { await route('archive'); assert.equal(await page.locator('#archive-table tbody tr').count(), 12); await page.locator('[data-tab="journal"]').click(); await page.locator('#archive-semester').selectOption('2025-2026-2'); assert.equal(await page.locator('#archive-table tbody tr').count(), 6); await page.locator('#archive-department').selectOption('software'); assert.equal(await page.locator('#archive-table tbody tr').count(), 3); });
  await check('all routes render and unknown route gives 404', async () => { for (const r of ['overview', 'search', 'attendance', 'journal', 'plan', 'books', 'calculation', 'messages', 'feedback', 'logs', 'archive', 'contact', 'not-a-route']) { await route(r); assert.ok((await page.locator('#app h1').innerText()).length); } assert.equal(await page.locator('#app h1').innerText(), '404'); });
  await check('department filter persists', async () => { await route('overview'); await page.locator('#department').selectOption('systems'); await page.waitForFunction(() => document.querySelectorAll('.schedule-row').length === 3); await page.reload(); await page.locator('.schedule-row').first().waitFor(); assert.equal(await page.locator('.schedule-row').count(), 3); await page.locator('#department').selectOption('all'); });
  await check('back forward refresh and keyboard skip link', async () => {
    await route('search'); await page.locator('.app-sidebar a[href="#/plan"]').click(); await page.locator('.week-grid').waitFor(); await page.goBack(); await page.locator('#filters').waitFor(); await page.goForward(); await page.locator('.week-grid').waitFor();
    await page.locator('.skip-link').focus(); await page.keyboard.press('Enter'); assert.match(page.url(), /#\/plan/); assert.equal(await page.locator('#main-content').evaluate(el => el === document.activeElement), true);
  });
  await check('loading failure retries and stale route cannot overwrite', async () => {
    const isolated = await browser.newContext();
    await isolated.addInitScript(() => localStorage.setItem('con354.v1.session', JSON.stringify({ name: 'Test', role: 'teacher', studentId: 'SW26-001' })));
    const p = await isolated.newPage();
    await p.route('**/data/courses.json', r => r.abort()); await p.goto(base + '#/search'); await p.locator('#retry').waitFor();
    await p.unroute('**/data/courses.json'); await p.locator('#retry').click(); await p.locator('#results tbody tr').first().waitFor();
    await p.reload(); await p.locator('#results tbody tr').first().waitFor();
    await p.route('**/data/courses.json', async r => { await new Promise(resolve => setTimeout(resolve, 250)); await r.continue(); });
    await p.goto(base + '#/search'); await p.evaluate(() => { location.hash = '/contact'; }); await p.locator('h1', { hasText: 'Тусламж' }).waitFor();
    await p.waitForTimeout(400); assert.equal(await p.locator('#app h1').innerText(), 'Тусламж'); await isolated.close();
  });
  await check('mobile layout and menu', async () => { await page.setViewportSize({ width: 390, height: 844 }); await route('overview'); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); await page.locator('#menu-toggle').click(); await page.locator('.app-sidebar a[href="#/search"]').click(); await page.locator('#filters').waitFor(); await page.screenshot({ path: 'test-results/mobile.png', fullPage: true }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); });
  await check('student demo cannot edit attendance or grades', async () => { await page.setViewportSize({ width: 1440, height: 1000 }); await page.locator('#logout').click(); await page.locator('#login-form').waitFor(); await page.locator('input[value="student"]').check(); await page.locator('#login-form button').click(); await page.locator('.welcome-card').waitFor(); await route('journal'); assert.equal(await page.locator('#grades-form button').count(), 0); assert.ok(await page.locator('[data-component]').first().isDisabled()); await route('attendance'); assert.equal(await page.locator('#attendance-form button').count(), 0); });
  await check('no uncaught errors or missing assets', async () => assert.deepEqual(errors, []));
  await context.close();
} finally {
  await writeFile('test-results/browser-report.json', JSON.stringify({ results, errors }, null, 2));
  await browser?.close(); processServer.kill();
}
console.log(`${results.length} browser scenarios passed.`);
