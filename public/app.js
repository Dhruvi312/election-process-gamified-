// ===== MATDATA SAARTHI — App Logic =====

// --- Navigation ---
const screens = document.querySelectorAll('.screen');
const navBtns = document.querySelectorAll('.nav-btn');

function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.screen));
});

// Quiz CTA
document.getElementById('btn-go-quiz').addEventListener('click', () => showScreen('quiz'));
document.getElementById('quiz-cta-btn').addEventListener('click', (e) => { e.stopPropagation(); showScreen('quiz'); });

// --- Countdown ---
function updateCountdown() {
  const target = new Date('2026-07-01T00:00:00');
  const now = new Date();
  const diff = Math.max(0, Math.ceil((target - now) / 86400000));
  document.getElementById('days-left').textContent = diff;
}
updateCountdown();

// --- Checklist Items ---
const checkItems = [
  { id: 'check-booth', circle: 'circle-booth', pts: 100, label: 'Booth Ready' },
  { id: 'check-aware', circle: 'circle-aware', pts: 50, label: 'Awareness Done' }
];
let totalPoints = 450;

checkItems.forEach(item => {
  const el = document.getElementById(item.id);
  const circle = document.getElementById(item.circle);
  let done = false;
  el.addEventListener('click', () => {
    if (done) return;
    done = true;
    circle.textContent = '✓';
    circle.classList.add('done-circle');
    el.classList.add('done');
    totalPoints += item.pts;
    showToast(`+${item.pts} pts — ${item.label}! 🎉`);
  });
});

// --- Quiz Data ---
const questions = [
  {
    q: 'What is the minimum age to vote in Indian general elections?',
    opts: ['16 years', '18 years', '21 years', '25 years'],
    ans: '18 years',
    fact: 'The 61st Constitutional Amendment (1988) lowered the voting age from 21 to 18 years in India.',
    pts: 50
  },
  {
    q: 'Which body conducts Lok Sabha elections in India?',
    opts: ['Parliament of India', 'Supreme Court', 'Election Commission of India', 'Cabinet Secretariat'],
    ans: 'Election Commission of India',
    fact: 'The Election Commission of India (ECI) is an autonomous constitutional body established on January 25, 1950 — celebrated as National Voters Day.',
    pts: 50
  },
  {
    q: 'How many phases were there in the 2024 Lok Sabha election?',
    opts: ['5', '6', '7', '9'],
    ans: '7',
    fact: 'The 2024 Lok Sabha elections ran from April 19 to June 1, 2024 across 7 phases covering all 543 constituencies.',
    pts: 50
  },
  {
    q: 'What does NOTA stand for in Indian elections?',
    opts: ['No Other Than Approved', 'None Of The Above', 'National Official Total Abstain', 'Not One To Abstain'],
    ans: 'None Of The Above',
    fact: 'NOTA was introduced in India in 2013 following a Supreme Court ruling. It appears as the last option on EVMs.',
    pts: 50
  },
  {
    q: 'How many voters were registered for the 2024 Lok Sabha elections?',
    opts: ['75 Crore', '85 Crore', '97.97 Crore', '105 Crore'],
    ans: '97.97 Crore',
    fact: 'India had 97.97 crore (979.7 million) registered electors in 2024 — the largest democratic election ever held on Earth.',
    pts: 50
  }
];

let currentQ = 0;
let quizScore = 150;
let streak = 2;
let answered = false;

function loadQuestion() {
  const q = questions[currentQ];
  document.getElementById('quiz-question').textContent = q.q;
  document.getElementById('q-num').textContent = currentQ + 1;
  document.getElementById('ql-num').textContent = currentQ + 1;
  document.getElementById('quiz-fact').textContent = q.fact;
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-next-btn').style.display = 'none';
  answered = false;

  const optContainer = document.getElementById('quiz-options');
  optContainer.innerHTML = '';
  q.opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(opt, q));
    optContainer.appendChild(btn);
  });
}

function handleAnswer(chosen, q) {
  if (answered) return;
  answered = true;
  const allOpts = document.querySelectorAll('.quiz-opt');
  const fb = document.getElementById('quiz-feedback');

  allOpts.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === q.ans) btn.classList.add('correct');
    else if (btn.textContent === chosen && chosen !== q.ans) btn.classList.add('wrong');
  });

  if (chosen === q.ans) {
    quizScore += q.pts;
    streak++;
    fb.textContent = `✅ Correct! +${q.pts} points earned!`;
    fb.className = 'quiz-feedback correct';
  } else {
    streak = 0;
    fb.textContent = `❌ Wrong! Correct: ${q.ans}`;
    fb.className = 'quiz-feedback wrong';
  }

  document.getElementById('quiz-score').textContent = quizScore;
  document.getElementById('q-streak').textContent = streak;
  document.getElementById('quiz-next-btn').style.display = 'block';
}

document.getElementById('quiz-next-btn').addEventListener('click', () => {
  currentQ = (currentQ + 1) % questions.length;
  loadQuestion();
  if (currentQ === 0) showToast('🔁 Quiz restarted — keep learning!');
});

loadQuestion();

// --- FAB Voice Saarthi ---
document.getElementById('fab-saarthi').addEventListener('click', () => {
  showToast('🎙️ Voice Saarthi: Say "check my registration" or "find my booth"');
});

// --- Toast ---
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== DARK MODE =====
const darkBtn = document.getElementById('dark-toggle');
const html = document.documentElement;
let dark = localStorage.getItem('darkMode') === '1';
function applyDark() {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  darkBtn.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', dark ? '1' : '0');
}
applyDark();
darkBtn.addEventListener('click', () => { dark = !dark; applyDark(); showToast(dark ? '🌙 Dark mode on' : '☀️ Light mode on'); });

// ===== LANGUAGE TOGGLE (EN / हि) =====
const langBtn = document.getElementById('lang-toggle');
const STRINGS = {
  en: {
    greeting: 'Namaste, Rahul 👋', sub: 'Ready to make a difference?',
    status: 'Application Status Tracker', lb: 'District Leaderboard 🏅'
  },
  hi: {
    greeting: 'नमस्ते, राहुल 👋', sub: 'बदलाव के लिए तैयार हैं?',
    status: 'आवेदन स्थिति ट्रैकर', lb: 'जिला लीडरबोर्ड 🏅'
  }
};
let lang = 'en';
langBtn.addEventListener('click', () => {
  lang = lang === 'en' ? 'hi' : 'en';
  langBtn.textContent = lang === 'en' ? 'हि' : 'EN';
  html.lang = lang === 'hi' ? 'hi' : 'en';
  const s = STRINGS[lang];
  document.getElementById('home-greeting').textContent = s.greeting;
  document.getElementById('home-subgreeting').textContent = s.sub;
  document.getElementById('status-title').textContent = s.status;
  document.getElementById('lb-title').textContent = s.lb;
  showToast(lang === 'hi' ? '🇮🇳 हिंदी चालू' : '🇮🇳 English on');
});

// ===== VOTER SEARCH =====
document.getElementById('search-submit').addEventListener('click', handleSearch);
document.getElementById('voter-search').addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
function handleSearch() {
  const val = document.getElementById('voter-search').value.trim();
  const res = document.getElementById('search-result');
  if (!val) { res.textContent = '⚠️ Please enter a name or EPIC number.'; res.style.color = '#e53935'; return; }
  res.style.color = 'var(--green)';
  res.textContent = '🔍 Redirecting to ECI Voter Search...';
  setTimeout(() => {
    window.open(`https://electoralsearch.eci.gov.in/?lang=en&searchBy=name&qn=${encodeURIComponent(val)}`, '_blank', 'noopener');
    res.textContent = '✅ Opened ECI Electoral Search Portal';
  }, 600);
}

// ===== STATUS TRACKER =====
document.getElementById('track-btn').addEventListener('click', () => {
  const val = document.getElementById('ref-id-input').value.trim();
  if (!val) { showToast('⚠️ Enter a valid Reference ID'); return; }
  const steps = document.getElementById('status-steps');
  steps.style.display = 'flex';
  steps.style.animation = 'fadeSlideIn .3s ease';
  showToast('✅ Status loaded for: ' + val);
});

// ===== WHATSAPP SHARE =====
document.getElementById('wa-share').addEventListener('click', () => {
  const msg = encodeURIComponent('🗳️ My Polling Booth:\nConstituency: Kasba Peth (200)\nPart: 12, S.No: 44\nAddress: Kasba Ganpati School, Pune\n\nCheck yours: https://voters.eci.gov.in\nCall: 1950');
  window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener');
});

// ===== I VOTED BADGE =====
document.getElementById('i-voted-btn').addEventListener('click', () => {
  const msg = encodeURIComponent('🗳️ I voted today! Proud to be part of India\'s democracy 🇮🇳\nHave you voted? Check your status at: https://matdata-saarthi-2026.web.app\n#MatdataSaarthi #IVoted #Election2026');
  if (navigator.share) {
    navigator.share({ title: 'I Voted! 🗳️', text: decodeURIComponent(msg), url: 'https://matdata-saarthi-2026.web.app' });
  } else {
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener');
  }
  showToast('🎉 Sharing your "I Voted" badge!');
});

// ===== PWA SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('✅ Matdata Saarthi: Offline mode ready'))
      .catch(e => console.warn('SW failed:', e));
  });
}

