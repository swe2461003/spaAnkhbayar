import { getFeedback, addFeedback, updateFeedback } from '../services/feedbackService.js';
import { canEdit, getSession } from '../services/authService.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { t, formatDate } from '../i18n/i18n.js';
import { panel, button, field, select, badge, toast, listen } from '../components/ui.js';
import { escapeHtml as e } from '../fn/format.js';
export async function renderFeedbackPage({ root, signal }) {
  let items = await getFeedback(); if (signal.aborted) return;
  const editor = canEdit();
  root.innerHTML = renderPageLayout({ title: t('feedback'), subtitle: t('feedbackHelp'), content: `<div class="split-equal">${panel(t('feedback'), `<form id="feedback-form">${field(t('category'), select('category', ['teaching', 'technical', 'other'].map(v => [v, t(v)])))}${field(t('message'), '<textarea class="textarea" name="text" required maxlength="3000" rows="6"></textarea>')}<label class="checkbox mb-5"><input type="checkbox" name="anonymous" checked> ${t('anonymous')}</label>${button(t('send'), 'type="submit"')}</form>`)}${panel(t('feedback'), `${field(t('category'), select('filter', ['all', 'teaching', 'technical', 'other'].map(v => [v, t(v)]), 'all', 'id="feedback-filter"'))}<div id="feedback-list"></div>`)}</div>` });
  const draw = () => {
    const filter = root.querySelector('#feedback-filter').value;
    const filtered = items.filter(f => filter === 'all' || f.category === filter);
    root.querySelector('#feedback-list').innerHTML = filtered.map(f => `<article class="feedback-item"><div class="row-between">${badge(t(f.category), 'blue')}<small class="muted">${formatDate(f.date)}</small></div><p>${e(f.text)}</p><div class="row-between"><small>${e(f.name || t('anonymous'))}</small>${editor ? select('status', ['new', 'reviewed', 'resolved'].map(v => [v, t(v)]), f.status, `data-feedback="${e(f.id)}" aria-label="${t('status')}"`) : badge(t(f.status), 'gray')}</div></article>`).join('') || `<p class="empty-state">${t('empty')}</p>`;
  };
  root.querySelector('#feedback-filter').onchange = draw;
  root.querySelector('#feedback-form').onsubmit = async ev => { ev.preventDefault(); const form = ev.currentTarget; const data = new FormData(form); const submit = form.querySelector('button'); submit.disabled = true; try { await addFeedback({ category: data.get('category'), text: data.get('text'), name: data.has('anonymous') ? null : getSession()?.name }); items = await getFeedback(); if (!signal.aborted) { form.reset(); draw(); toast(); } } catch { toast(t('invalid')); } finally { submit.disabled = false; } };
  listen(root, 'change', '[data-feedback]', async (_, el) => { try { await updateFeedback(el.dataset.feedback, el.value); items = await getFeedback(); toast(); } catch { toast(t('invalid')); } });
  draw();
}
