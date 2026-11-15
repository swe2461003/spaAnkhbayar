import { getMessages, sendMessage } from '../services/messageService.js';
import { renderPageLayout } from '../layouts/pageLayout.js';
import { t } from '../i18n/i18n.js';
import { button, input, toast, listen } from '../components/ui.js';
import { escapeHtml as e } from '../fn/format.js';
export async function renderMessagesPage({ root, signal }) {
  let messages = await getMessages(); if (signal.aborted) return;
  const contacts = [['teacher', 'Б. Анар', t('teacher')], ['office', 'ХААИС', t('faculty')], ['group', 'ПХ-21 / МС-22', t('group')]];
  let contact = 'teacher';
  root.innerHTML = renderPageLayout({ title: t('messages'), subtitle: t('localChat'), content: `<div class="chat-layout panel-card flush"><aside class="chat-contacts">${contacts.map(([id, name, role]) => `<button data-contact="${id}"><span class="avatar">${e(name.slice(0, 2))}</span><span><strong>${e(name)}</strong><small>${e(role)}</small></span></button>`).join('')}</aside><section class="chat-main"><div class="panel-heading"><h2 id="chat-title"></h2></div><div id="chat-history" class="chat-history" role="log" aria-live="polite"></div><form id="message-form" class="chat-compose">${input('text', '', 'text', `required maxlength="2000" autocomplete="off" aria-label="${t('message')}" placeholder="${t('message')}…"`)}${button(t('send'), 'type="submit"')}</form></section></div>` });
  const draw = () => {
    root.querySelector('#chat-title').textContent = contacts.find(c => c[0] === contact)[1];
    root.querySelectorAll('[data-contact]').forEach(el => { el.classList.toggle('selected', el.dataset.contact === contact); el.setAttribute('aria-pressed', String(el.dataset.contact === contact)); });
    const history = root.querySelector('#chat-history');
    history.innerHTML = messages.filter(m => m.contact === contact).map(m => `<div class="chat-bubble ${m.from === 'me' ? 'mine' : ''}"><p>${e(m.text)}</p><small>${e(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ulaanbaatar' }).format(new Date(m.date)))}</small></div>`).join('') || `<p class="empty-state">${t('empty')}</p>`;
    history.scrollTop = history.scrollHeight;
  };
  listen(root, 'click', '[data-contact]', (_, el) => { contact = el.dataset.contact; draw(); });
  root.querySelector('form').onsubmit = async ev => { ev.preventDefault(); const form = ev.currentTarget; const submit = form.querySelector('button'); submit.disabled = true; try { await sendMessage(contact, new FormData(form).get('text')); messages = await getMessages(); if (!signal.aborted) { form.reset(); draw(); } } catch { toast(t('invalid')); } finally { submit.disabled = false; } };
  draw();
}
