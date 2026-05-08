import './style.css';

// Game Scenarios
const scenarios = [
  {
    id: 1,
    subject: "Urgent: Unusual Login Activity Detected",
    sender: "Nexus IT Support <support@nexus-security-alert.net>",
    body: `
      <p>Hello Employee,</p>
      <p>We detected an unusual login to your Nexus account from an unrecognized device in Eastern Europe.</p>
      <p>If this was not you, please click the button below to secure your account immediately. Failure to do so within 24 hours will result in permanent account suspension.</p>
      <div style="margin: 20px 0; text-align: center;">
        <a href="#" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Verify My Identity</a>
      </div>
      <p>Thank you,<br>Nexus Security Team</p>
    `,
    isPhishing: true,
    explanation: "This was a classic credential harvesting attack. The urgency and threat of suspension are common tactics.",
    redFlags: [
      "The sender domain '@nexus-security-alert.net' is not the official '@nexus-corp.com'.",
      "Urgent language designed to make you act without thinking ('Failure to do so within 24 hours').",
      "Generic greeting ('Hello Employee') instead of your name."
    ]
  },
  {
    id: 2,
    subject: "Benefits Enrollment Reminder - Action Required",
    sender: "Human Resources <hr@nexus-corp.com>",
    body: `
      <p>Hi Team,</p>
      <p>Friendly reminder that the open enrollment period for our 2026 benefits package ends this Friday.</p>
      <p>Please log in to the Nexus Employee Portal (https://portal.nexus-corp.com) to review and confirm your selections. If you've already completed this, you can ignore this message.</p>
      <p>Regards,<br>Sarah Miller<br>Director of HR</p>
    `,
    isPhishing: false,
    explanation: "This is a legitimate internal communication. It uses the correct domain and directs you to a known internal portal.",
    redFlags: []
  },
  {
    id: 3,
    subject: "Overdue Invoice #INV-88219",
    sender: "Billing Dept <no-reply@amazon-payments-verify.com>",
    body: `
      <p>Dear Valued Customer,</p>
      <p>Your payment for order #INV-88219 is overdue. Please find the attached PDF invoice for details.</p>
      <p>To avoid late fees, please pay immediately using our secure portal linked in the attachment.</p>
      <p>Best Regards,<br>Global Finance Team</p>
    `,
    isPhishing: true,
    explanation: "This is a fake invoice scam. These are often used to spread malware via attachments or steal payment info.",
    redFlags: [
      "The sender uses a lookalike domain ('amazon-payments-verify.com').",
      "Generic greeting and lack of specific order details in the body.",
      "The call to action relies on opening an attachment from an unexpected sender."
    ]
  },
  {
    id: 4,
    subject: "New Shared Document: 'Q3 Financial Goals.xlsx'",
    sender: "John Davis (via Google Docs) <share-noreply@google.com>",
    body: `
      <p>John Davis (john.davis@nexus-corp.com) has invited you to edit the following document:</p>
      <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #4285f4;">
        <strong>Q3 Financial Goals.xlsx</strong>
      </div>
      <p><a href="#" style="color: #4285f4;">Open in Docs</a></p>
      <p>Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</p>
    `,
    isPhishing: false,
    explanation: "This is a standard Google Docs notification. The sender 'share-noreply@google.com' is legitimate, and the inviter is a known colleague.",
    redFlags: []
  },
  {
    id: 5,
    subject: "RE: Your Starbucks Gift Card",
    sender: "Employee Rewards <rewards@nxus-corp.com>",
    body: `
      <p>Hey there!</p>
      <p>As a thank you for your hard work this quarter, Nexus Corp is giving everyone a $50 Starbucks gift card.</p>
      <p>Claim yours here: <a href="#">http://nxus-rewards.com/claim/5592</a></p>
      <p>Enjoy your coffee!</p>
    `,
    isPhishing: true,
    explanation: "This is a corporate 'lure' phishing attempt, often used to test employee vigilance.",
    redFlags: [
      "The sender domain has a typo: '@nxus-corp.com' instead of '@nexus-corp.com'.",
      "The claim link leads to an external, unofficial domain.",
      "Gift card offers are common phishing bait."
    ]
  }
];

// Game State
let state = {
  currentScenarioIndex: 0,
  score: 0,
  lives: 3,
  level: 1,
  badges: []
};

// DOM Elements
const elements = {
  subject: document.getElementById('msg-subject'),
  sender: document.getElementById('msg-sender'),
  body: document.getElementById('msg-body'),
  score: document.getElementById('score-value'),
  lives: document.getElementById('lives-value'),
  btnReport: document.getElementById('btn-report'),
  btnTrust: document.getElementById('btn-trust'),
  feedbackOverlay: document.getElementById('feedback-overlay'),
  feedbackStatus: document.getElementById('feedback-status'),
  feedbackExplanation: document.getElementById('feedback-explanation'),
  redFlagsContainer: document.getElementById('red-flags-container'),
  redFlagsList: document.getElementById('red-flags-list'),
  btnNext: document.getElementById('btn-next'),
  levelBadge: document.getElementById('level-badge'),
  levelTitle: document.getElementById('level-title'),
  levelName: document.getElementById('level-name'),
  phishOMeter: document.getElementById('phish-o-meter'),
  meterStatus: document.getElementById('meter-status'),
  navGame: document.getElementById('nav-game'),
  navAcademy: document.getElementById('nav-academy'),
  gameView: document.querySelector('main'),
  academyView: document.getElementById('academy-view')
};

// Functions
// Badges
const BADGES = {
  PERFECT_START: { icon: '🛡️', name: 'Shield Initiate', desc: 'Got the first 3 scenarios correct without a mistake.' },
  EAGLE_EYE: { icon: '👁️', name: 'Eagle Eye', desc: 'Spotted 5 phishing attempts.' },
  LEVEL_UP: { icon: '🚀', name: 'Field Agent', desc: 'Reached Level 2.' }
};

function updateUI() {
  const scenario = scenarios[state.currentScenarioIndex];
  elements.subject.textContent = scenario.subject;
  elements.sender.textContent = scenario.sender;
  elements.body.innerHTML = scenario.body;
  elements.score.textContent = state.score;
  elements.lives.textContent = '❤'.repeat(Math.max(0, state.lives));
  
  // Animation reset
  const scenarioContainer = document.getElementById('scenario-container');
  scenarioContainer.classList.remove('animate-fade');
  void scenarioContainer.offsetWidth; // trigger reflow
  scenarioContainer.classList.add('animate-fade');

  // Level progression
  if (state.score >= 3 && !state.badges.includes('PERFECT_START') && state.lives === 3) {
    awardBadge('PERFECT_START');
  }

  if (state.score >= 5) {
    state.level = 2;
    elements.levelBadge.textContent = 'Level 2';
    elements.levelTitle.textContent = 'Advanced Deception';
    elements.levelName.textContent = 'Security Officer';
    if (!state.badges.includes('LEVEL_UP')) awardBadge('LEVEL_UP');
  }

  updatePhishOMeter();
  updateBadgesUI();
}

function updatePhishOMeter() {
  const percentage = Math.min(100, (state.score / 10) * 100);
  elements.phishOMeter.style.width = `${percentage}%`;
  
  if (percentage < 30) {
    elements.phishOMeter.style.background = 'var(--danger)';
    elements.meterStatus.textContent = 'STATUS: VULNERABLE';
  } else if (percentage < 70) {
    elements.phishOMeter.style.background = 'var(--warning)';
    elements.meterStatus.textContent = 'STATUS: ALERT';
  } else {
    elements.phishOMeter.style.background = 'var(--success)';
    elements.meterStatus.textContent = 'STATUS: SECURE';
  }
}

function awardBadge(badgeKey) {
  if (!state.badges.includes(badgeKey)) {
    state.badges.push(badgeKey);
    const badge = BADGES[badgeKey];
    console.log(`Badge Awarded: ${badge.name}`);
    // Optional: Show toast or alert
  }
}

function updateBadgesUI() {
  const container = document.getElementById('badges-container');
  if (state.badges.length === 0) {
    container.innerHTML = '<div style="opacity: 0.3;">No badges yet</div>';
    return;
  }
  container.innerHTML = state.badges.map(key => `
    <div class="badge-item" title="${BADGES[key].desc}" style="background: rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 8px; font-size: 1.2rem; cursor: help;">
      ${BADGES[key].icon}
    </div>
  `).join('');
}

function showFeedback(isCorrect, scenario) {
  elements.feedbackStatus.textContent = isCorrect ? 'CORRECT!' : 'Ouch! You got Phished.';
  elements.feedbackStatus.className = `feedback-status ${isCorrect ? 'correct' : 'incorrect'}`;
  elements.feedbackExplanation.textContent = scenario.explanation;

  if (scenario.isPhishing) {
    elements.redFlagsContainer.style.display = 'block';
    elements.redFlagsList.innerHTML = scenario.redFlags.map(flag => `<li>${flag}</li>`).join('');
  } else {
    elements.redFlagsContainer.style.display = 'none';
  }

  elements.feedbackOverlay.classList.add('active');
}

function handleDecision(isReporting) {
  const scenario = scenarios[state.currentScenarioIndex];
  const isCorrect = isReporting === scenario.isPhishing;

  if (isCorrect) {
    state.score += 1;
  } else {
    state.lives -= 1;
    if (state.lives <= 0) {
      alert("Game Over! Your security clearance has been revoked. Restarting...");
      state.lives = 3;
      state.score = 0;
      state.currentScenarioIndex = 0;
    }
  }

  showFeedback(isCorrect, scenario);
}

function nextScenario() {
  elements.feedbackOverlay.classList.remove('active');
  state.currentScenarioIndex = (state.currentScenarioIndex + 1) % scenarios.length;
  updateUI();
}

function switchView(view) {
  if (view === 'game') {
    elements.gameView.style.display = 'grid';
    elements.academyView.style.display = 'none';
    elements.navGame.classList.add('active');
    elements.navAcademy.classList.remove('active');
  } else {
    elements.gameView.style.display = 'none';
    elements.academyView.style.display = 'block';
    elements.navGame.classList.remove('active');
    elements.navAcademy.classList.add('active');
  }
}

// Event Listeners
elements.btnReport.addEventListener('click', () => handleDecision(true));
elements.btnTrust.addEventListener('click', () => handleDecision(false));
elements.btnNext.addEventListener('click', nextScenario);
elements.navGame.addEventListener('click', () => switchView('game'));
elements.navAcademy.addEventListener('click', () => switchView('academy'));

// Initialize
updateUI();
