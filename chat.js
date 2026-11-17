// Demo HVAC Co. chat embed.
// Mode 1 (publicKey set): official Retell website widget -> draft chat agent.
// Mode 2 (publicKey empty): scripted PREVIEW widget. No AI, no network, no cost.
(function () {
  var cfg = window.DEMO_CHAT || {};
  if (cfg.publicKey) {
    var s = document.createElement('script');
    s.id = 'retell-widget';
    s.src = 'https://dashboard.retellai.com/retell-widget-v2.js';
    s.setAttribute('data-public-key', cfg.publicKey);
    s.setAttribute('data-agent-id', cfg.agentId);
    s.setAttribute('data-title', cfg.title || 'Chat with us');
    s.setAttribute('data-color', cfg.color || '#0b5cab');
    s.setAttribute('data-fab-text', 'Chat with us');
    s.setAttribute('data-show-ai-popup', 'false');
    s.setAttribute('data-bot-name', 'Demo HVAC Co. AI Assistant');
    document.head.appendChild(s);
    return;
  }

  var GREETING = "Hi, I'm the AI assistant for Demo HVAC Co. (a fictional company built by RoMar Digital to show what a website chatbot can do). I'm an automated assistant, not a person. I can answer questions about hours and service area or take a service request. If you smell gas or a CO alarm is going off, leave the home and call 911. How can I help?";
  var SAFETY = "That could be dangerous. If you smell gas or a CO alarm is sounding, leave the home now and call 911 or the gas utility from outside. If there is smoke, sparks, or flooding, get everyone to safety and call 911. Please don't try to fix it yourself. I can't connect you live from this chat, so please call 911 first.";
  var RULES = [
    [/gas|carbon monoxide|\bco\b|smoke|spark|burning|flood|leak/i, SAFETY],
    [/robot|real person|human|ai\b|bot\b/i, "I'm an automated AI assistant for Demo HVAC Co. I can answer questions and take your details for the team."],
    [/hour|open|close|when/i, "The office is open Monday to Friday, 8 AM to 5 PM Eastern. On-call technicians handle emergencies 24/7."],
    [/area|zip|where|serve|miami|broward|palm|boca|lauderdale/i, "We serve Palm Beach, Broward, and Miami-Dade counties, including West Palm Beach, Boca Raton, Fort Lauderdale, and Miami (ZIP codes 33000-33499). Outside that area, the office will call back to help or refer."],
    [/price|cost|how much|fee|quote|diagnostic/i, "The technician or office will go over pricing before any work. The office will confirm the diagnostic fee."],
    [/financ|payment|pay\b|card/i, "Payment is taken by the technician or the office after service. Please don't share card numbers here. Financing may be available on new systems, subject to approval, and the office can explain the options."],
    [/maintenance|tune|plan/i, "We offer a maintenance plan with spring and fall tune-ups and priority scheduling. The office can share plan details and pricing."],
    [/brand|carrier|trane|lennox|rheem|goodman/i, "We service most major furnace, air-conditioner, and heat-pump brands. The office can confirm specific brands and parts availability."],
    [/warrant/i, "Repairs and installations carry warranties that vary by job and manufacturer. The office can confirm coverage for your equipment."],
    [/book|appointment|schedule|service|repair|not cool|no heat|no cool|broken|a\/c|ac\b|furnace/i, "I can help request service. To keep this demo simple, please use the Request service form on this page, or call our AI receptionist at (208) 934-0280 to book a fake service call. Appointment times are requested, and the office confirms them."],
    [/spanish|espa/i, "The live chatbot also answers in Spanish. This preview widget is English-only."]
  ];
  var FALLBACK = "I'm not sure about that, and I don't want to guess. The office will follow up. You can also call our AI receptionist at (208) 934-0280.";

  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt) e.textContent = txt; return e; }
  var fab = el('button', 'cw-fab', 'Chat with us');
  fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-controls', 'cw-panel');
  var panel = el('div', 'cw-panel'); panel.id = 'cw-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Chat with Demo HVAC Co. AI assistant');
  var head = el('div', 'cw-head');
  var ht = el('div'); ht.appendChild(el('strong', '', 'Demo HVAC Co. AI Assistant')); ht.appendChild(el('small', '', 'Automated assistant, not a person'));
  var x = el('button', 'cw-x', '\u00d7'); x.setAttribute('aria-label', 'Close chat');
  head.appendChild(ht); head.appendChild(x);
  var log = el('div', 'cw-log'); log.setAttribute('aria-live', 'polite');
  var chips = el('div', 'cw-chips');
  ['Hours', 'Service area', 'Financing', 'Request service'].forEach(function (t) {
    var b = el('button', '', t); b.type = 'button'; b.addEventListener('click', function () { send(t); }); chips.appendChild(b);
  });
  var form = el('form', 'cw-form'); var inp = el('input'); inp.placeholder = 'Type your question'; inp.setAttribute('aria-label', 'Your message');
  var go = el('button', '', 'Send'); go.type = 'submit'; form.appendChild(inp); form.appendChild(go);
  var note = el('div', 'cw-note', 'Preview mode: scripted answers only. The live version is an AI chatbot. Chats may be recorded. Don\u2019t share personal or payment details.');
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips); panel.appendChild(form); panel.appendChild(note);
  document.body.appendChild(fab); document.body.appendChild(panel);

  function add(text, who) { var m = el('div', 'cw-msg ' + (who === 'me' ? 'cw-me' : 'cw-bot'), text); log.appendChild(m); log.scrollTop = log.scrollHeight; }
  function reply(q) { for (var i = 0; i < RULES.length; i++) { if (RULES[i][0].test(q)) return RULES[i][1]; } return FALLBACK; }
  function send(t) { add(t, 'me'); setTimeout(function () { add(reply(t), 'bot'); }, 350); }
  function toggle(open) {
    panel.classList.toggle('open', open); fab.setAttribute('aria-expanded', String(open));
    if (open) { if (!log.children.length) add(GREETING, 'bot'); inp.focus(); }
  }
  fab.addEventListener('click', function () { toggle(!panel.classList.contains('open')); });
  x.addEventListener('click', function () { toggle(false); fab.focus(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); var t = inp.value.trim(); if (t) { inp.value = ''; send(t); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) { toggle(false); fab.focus(); } });
  if (window.location.search.indexOf('chat=open') > -1) toggle(true);
})();
