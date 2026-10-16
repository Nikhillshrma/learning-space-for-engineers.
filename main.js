/* ================================================================
   ENGIVERSE — main.js
   All interactivity lives here. Sections:
   1. Particle background      5. Fake compiler console
   2. Scroll reveal            6. Snap Streak feature
   3. Button ripples           7. AI Teacher chat widget
   4. Hero typing + arena stats
   ================================================================ */

/* ---------- 1. PARTICLE BACKGROUND (canvas) ---------- */
(function particles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const COLORS = ['#a855f7', '#22d3ee', '#4ade80', '#f472b6'];
  let dots = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  resize();
  addEventListener('resize', resize);

  // spawn ~1 dot per 22k px², capped for perf
  const COUNT = Math.min(70, Math.floor(innerWidth * innerHeight / 22000));
  for (let i = 0; i < COUNT; i++) {
    dots.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 2 + 0.6,
      vx: (Math.random() - .5) * 0.35,
      vy: (Math.random() - .5) * 0.35,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.5 + 0.15
    });
  }

  (function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      // wrap around edges
      if (d.x < -10) d.x = canvas.width + 10;
      if (d.x > canvas.width + 10) d.x = -10;
      if (d.y < -10) d.y = canvas.height + 10;
      if (d.y > canvas.height + 10) d.y = -10;
      ctx.globalAlpha = d.a;
      ctx.fillStyle = d.c;
      ctx.shadowBlur = 8;
      ctx.shadowColor = d.c;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  })();
})();

/* ---------- 2. SCROLL REVEAL (IntersectionObserver, staggered) ---------- */
(function scrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // small stagger between siblings entering together
        setTimeout(() => e.target.classList.add('in'), (i % 6) * 90);
        io.unobserve(e.target);
        // when the arena panel appears, fire its number animations
        if (e.target.id === 'rank-dashboard') animateArena();
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ---------- 3. RIPPLE EFFECT on every button ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn, .run-btn, .dl-btn, .chat-send');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

/* ---------- 4a. HERO TYPING EFFECT ---------- */
(function typer() {
  const lines = [
    '> initializing grind_mode.exe ...',
    '> 6,120 XP loaded · Rank #347 and climbing',
    '> streak = 14 days 🔥 keep it alive',
    '> objective: TOP 100 by end of sem'
  ];
  const el = document.getElementById('type-line');
  let li = 0, ci = 0, deleting = false;

  (function step() {
    const line = lines[li];
    el.textContent = line.slice(0, ci);
    if (!deleting) {
      ci++;
      if (ci > line.length) { deleting = true; return setTimeout(step, 2100); }
      return setTimeout(step, 42);
    }
    ci--;
    if (ci < 0) { deleting = false; ci = 0; li = (li + 1) % lines.length; return setTimeout(step, 350); }
    setTimeout(step, 16);
  })();
})();

/* ---------- 4b. ARENA — percentile ring + bars + count-up ---------- */
function animateArena() {
  // circular ring: circumference = 2πr (r = 72)
  const RING_LEN = 2 * Math.PI * 72;
  const ring = document.getElementById('percentile-ring');
  const TARGET = 94; // percentile — tweak here
  ring.style.strokeDasharray = RING_LEN;
  ring.style.strokeDashoffset = RING_LEN;
  requestAnimationFrame(() => {
    ring.style.strokeDashoffset = RING_LEN * (1 - TARGET / 100);
  });

  // number count-up synced with the ring
  const numEl = document.getElementById('percentile-num');
  const start = performance.now(), DUR = 2000;
  (function count(t) {
    const p = Math.min(1, (t - start) / DUR);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    numEl.textContent = Math.round(TARGET * eased);
    if (p < 1) requestAnimationFrame(count);
  })(start);

  // grow the score bars
  document.querySelectorAll('.bar-fill').forEach((b, i) => {
    setTimeout(() => { b.style.width = b.dataset.w; }, 200 + i * 220);
  });
}

/* ---------- 5. CODE LAB — simulated compiler run ---------- */
(function codeLab() {
  const runBtn = document.getElementById('run-btn');
  const out = document.getElementById('console-out');
  let running = false;

  runBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    out.innerHTML = '';
    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running…';

    const lines = [
      { text: '$ python rank_predictor.py', cls: 'info', delay: 300 },
      { text: '[interpreter] compiling… OK (0.03s)', cls: 'info', delay: 900 },
      { text: 'Predicted National Rank: #47,634', cls: 'accent', delay: 1600 },
      { text: 'Keep the streak alive, Nikhil 🔥', cls: 'accent', delay: 2100 },
      { text: '✓ Process finished with exit code 0', cls: 'ok', delay: 2700 }
    ];

    lines.forEach(l => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'console-line ' + l.cls;
        div.textContent = l.text;
        out.appendChild(div);
        requestAnimationFrame(() => div.classList.add('show'));
      }, l.delay);
    });

    setTimeout(() => {
      runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
      running = false;
    }, 3000);
  });
})();

/* ---------- 6. SNAP STREAK — send snap w/ fire burst ---------- */
(function snapStreak() {
  const snapBtn = document.getElementById('snap-btn');
  const panel = document.getElementById('streak-panel');
  const toast = document.getElementById('toast');
  const streakNum = document.getElementById('streak-num');
  const navStreak = document.getElementById('nav-streak');
  const todayChip = document.getElementById('today-chip');
  const EMOJIS = ['🔥', '⚡', '✨', '💥'];
  let sentToday = false;

  snapBtn.addEventListener('click', () => {
    // 1) fire-particle burst from the button
    const btnRect = snapBtn.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    for (let i = 0; i < 16; i++) {
      const bit = document.createElement('span');
      bit.className = 'fire-bit';
      bit.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      // start at the button center (relative to the panel)
      bit.style.left = (btnRect.left - panelRect.left + btnRect.width / 2) + 'px';
      bit.style.top = (btnRect.top - panelRect.top + btnRect.height / 2) + 'px';
      // random explosion vector via CSS custom props
      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.5;
      const dist = 90 + Math.random() * 130;
      bit.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
      bit.style.setProperty('--fy', (Math.sin(angle) * dist - 60) + 'px');
      bit.style.setProperty('--fr', (Math.random() * 360 - 180) + 'deg');
      panel.appendChild(bit);
      setTimeout(() => bit.remove(), 1200);
    }

    // 2) bump the streak (only once per "day")
    if (!sentToday) {
      sentToday = true;
      const next = parseInt(streakNum.textContent, 10) + 1;
      streakNum.textContent = next;
      navStreak.textContent = next;
      todayChip.classList.add('lit');
      snapBtn.innerHTML = '<i class="fa-solid fa-check"></i> Snap Sent — Streak Saved!';
    }

    // 3) toast confirmation
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2600);
  });
})();

/* ---------- 7. AI TEACHER — chat widget (simulated replies) ---------- */
(function aiTeacher() {
  const fab = document.getElementById('ai-fab');
  const box = document.getElementById('chat-box');
  const closeBtn = document.getElementById('chat-close');
  const log = document.getElementById('chat-log');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  fab.addEventListener('click', () => {
    box.classList.toggle('open');
    if (box.classList.contains('open')) input.focus();
  });
  closeBtn.addEventListener('click', () => box.classList.remove('open'));

  // tiny keyword "brain" — swap for a real API later
  const REPLIES = [
    { keys: ['recursion'], text: 'Recursion = a function calling itself. 🌀 Two rules:\n1️⃣ Base case (when to STOP)\n2️⃣ Recursive case (shrink the problem)\n\nTry: factorial(n) = n * factorial(n-1), base: factorial(0) = 1' },
    { keys: ['pointer'], text: 'Pointers store *addresses*, not values. 📍\n\ncode: int x = 5; int *p = &x;\n\n*p reads the value at that address (5). Think of it as a home address vs the house itself. 🏠' },
    { keys: ['dsa', 'array', 'linked list'], text: 'Arrays = O(1) access, O(n) insert.\nLinked Lists = O(n) access, O(1) insert at head.\n\nRule of thumb: reading a lot? Array. Inserting/deleting a lot? Linked list. 📊' },
    { keys: ['fourier', 'signal'], text: 'Fourier transform = breaking a song into individual notes. 🎵 Any signal is just a mix of sine waves — FT tells you which frequencies and how strong. Start with the intuition, then the integrals.' },
    { keys: ['exam', 'gate', 'test'], text: 'GATE strategy: 🎯\n1️⃣ PYQs > everything (last 10 yrs, 3x)\n2️⃣ One mock/week now → daily in last month\n3️⃣ Maintain an error notebook\n\nYour 94 percentile says you\'re on track. Keep grinding!' },
    { keys: ['python', 'loop'], text: 'Pythonic loops:\n\nfor i, val in enumerate(items) — index + value\nfor a, b in zip(l1, l2) — parallel lists\n[x*2 for x in nums if x > 0] — comprehensions\n\nWrite less, do more. 🐍' },
    { keys: ['hello', 'hi', 'hey', 'yo'], text: 'Yo! 👋 Ready to level up? Ask me about recursion, pointers, DSA, signals, GATE prep… anything. Your streak is 🔥 btw.' }
  ];
  const FALLBACK = [
    'Great question! 🤔 Break it into smaller pieces — what\'s the ONE part confusing you most? Describe it and we\'ll crack it together.',
    'Interesting! Here\'s my 3-step debug method:\n1️⃣ Explain the problem out loud (rubber duck 🦆)\n2️⃣ Isolate the smallest failing case\n3️⃣ Check assumptions with print statements\n\nWhat have you tried so far?',
    'Love the curiosity! ⚡ Pro tip: the best engineers Google smart. Try searching "your topic + intuition" — then come back and I\'ll fill the gaps.'
  ];
  let fbIndex = 0;

  function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function botReply(userText) {
    // typing indicator
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;

    const lower = userText.toLowerCase();
    const hit = REPLIES.find(r => r.keys.some(k => lower.includes(k)));
    const text = hit ? hit.text : FALLBACK[fbIndex++ % FALLBACK.length];

    setTimeout(() => {
      typing.remove();
      addMsg(text, 'bot');
    }, 900 + Math.random() * 700);
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    botReply(text);
  }
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
})();

/* ---------- BONUS: fake "download" feedback on note cards ---------- */
document.querySelectorAll('.dl-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
    setTimeout(() => { btn.innerHTML = original; }, 1800);
  });
});
