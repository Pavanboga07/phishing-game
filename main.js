import './style.css';

// Game Scenarios
const scenarios = [
  {
    id: 1,
    platform: 'email',
    difficulty: 'easy',
    subject: "Urgent: Unusual Login Activity Detected",
    sender: "Nexus IT Support <support@nexus-security-alert.net>",
    body: `
      <p>Hello Employee,</p>
      <p>We detected an unusual login to your Nexus account from an unrecognized device in Eastern Europe.</p>
      <p>If this was not you, please click the button below to secure your account immediately.</p>
      <div style="margin: 20px 0; text-align: center;">
        <a href="#" class="simulated-link" data-url="http://nexus-verify-identity.com/login" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Verify My Identity</a>
      </div>
      <p>Thank you,<br>Nexus Security Team</p>
    `,
    isPhishing: true,
    explanation: "This was a classic credential harvesting attack. The domain '@nexus-security-alert.net' is a common lookalike tactic.",
    redFlags: ["Mismatched domain", "Urgent tone", "Generic greeting"]
  },
  {
    id: 2,
    platform: 'sms',
    difficulty: 'medium',
    subject: "SMS from [NexusHR]",
    sender: "+1 (888) 555-0199",
    body: `
      <div class="sms-bubble">
        [NEXUS-CORP] Your one-time verification code is 88291. If you did not request this, please secure your account at: https://nexus-corp.auth-secure.com
      </div>
    `,
    isPhishing: true,
    explanation: "Smishing often uses verification code lures. The URL 'nexus-corp.auth-secure.com' is a subdomain on a malicious domain 'auth-secure.com'.",
    redFlags: ["Suspicious URL structure", "Unsolicited 2FA code"]
  },
  {
    id: 3,
    platform: 'social',
    difficulty: 'hard',
    subject: "LinkedIn Message: Recruiter Contact",
    sender: "Sarah Jenkins (Senior Talent Lead)",
    body: `
      <p>Hi there! I saw your profile and I'm very impressed with your work at Nexus Corp.</p>
      <p>We're looking for someone with your exact skillset for a confidential project at a major competitor. The salary range is significantly higher than market average.</p>
      <p>You can view the full job description and benefits package here: <a href="#" class="simulated-link" data-url="https://dropbox-shared-files.net/s/job_desc_2026.zip">job_description_nexus_hire.zip</a></p>
    `,
    isPhishing: true,
    explanation: "This is spear phishing targeting professional curiosity. The '.zip' file on a lookalike 'dropbox-shared-files.net' domain likely contains malware.",
    redFlags: ["Unsolicited high-value offer", "Suspicious file attachment (.zip)", "Lookalike file sharing domain"]
  },
  {
    id: 4,
    platform: 'email',
    difficulty: 'medium',
    subject: "IT Security Policy Update - Required Signature",
    sender: "Global Compliance <compliance@nexus-corp.com>",
    body: `
      <p>Dear Employee,</p>
      <p>As part of our annual security audit, all employees are required to review and sign the updated Remote Work Policy by end of week.</p>
      <p>Please review the document on the internal SharePoint: <a href="#" class="simulated-link" data-url="https://nexuscorp.sharepoint.com/sites/compliance/policy2026">Nexus Policy 2026</a></p>
      <p>Thank you for your cooperation.</p>
    `,
    isPhishing: false,
    explanation: "This is a legitimate internal communication. It uses the correct internal SharePoint domain and official sender address.",
    redFlags: []
  },
  {
    id: 5,
    platform: 'email',
    difficulty: 'hard',
    subject: "Fwd: Q4 Budget Review - Action Needed",
    sender: "David Chen <david.chen@nexus-corp.com>",
    body: `
      <p>Hey, I'm stuck in a meeting but I need you to double check these numbers for the Q4 review before the board meeting at 3 PM.</p>
      <p>The spreadsheet is here: <a href="#" class="simulated-link" data-url="https://docs.google.com/spreadsheets/d/1vA.../edit">Q4_Budget_Draft_v2</a></p>
      <p>Thanks!</p>
    `,
    isPhishing: false,
    explanation: "This is a legitimate 'high-pressure' scenario from a known colleague. The link leads to an official Google Docs domain commonly used in the company.",
    redFlags: []
  }
];

// Game State
let state = {
  currentScenarioIndex: 0,
  score: 0,
  lives: 3,
  level: 1,
  badges: [],
  completedModules: [],
  currentModuleIndex: 0,
  gameUnlocked: false
};

const academyModules = [
  {
    id: 'basics',
    tag: 'Basics',
    title: 'What is Phishing?',
    content: '<p>Phishing is a type of cyber attack where attackers pose as legitimate organizations to trick individuals into revealing sensitive information like passwords, credit card numbers, or social security details.</p><div class="learning-tip">💡 90% of all data breaches start with a phishing email.</div>'
  },
  {
    id: 'types',
    tag: 'Types',
    title: 'The Phishing Spectrum',
    content: '<ul class="learning-list"><li><strong>Spear Phishing:</strong> Targeted attacks against specific individuals.</li><li><strong>Smishing:</strong> Phishing via SMS or text messages.</li><li><strong>Vishing:</strong> Voice phishing using phone calls.</li><li><strong>Whaling:</strong> Targeting high-level executives.</li></ul>'
  },
  {
    id: 'redflags',
    tag: 'Detection',
    title: 'Major Red Flags',
    content: '<ul class="learning-list"><li>🚩 <strong>Artificial Urgency:</strong> Threatening action.</li><li>🚩 <strong>Suspicious Domains:</strong> Lookalike URLs.</li><li>🚩 <strong>Unexpected Attachments:</strong> Unsolicited docs.</li><li>🚩 <strong>Generic Greeting:</strong> Non-personalized.</li></ul>'
  },
  {
    id: 'prevention',
    tag: 'Prevention',
    title: 'How to Protect Yourself',
    content: '<ul class="learning-list"><li>✅ <strong>Enable MFA:</strong> Use Multi-Factor Auth.</li><li>✅ <strong>Verify the Source:</strong> Contact via official sites.</li><li>✅ <strong>Hover Before You Click:</strong> Check real URLs.</li></ul>'
  }
];

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
  navLanding: document.getElementById('nav-landing'),
  gameView: document.querySelector('main'),
  academyView: document.getElementById('academy-view'),
  landingView: document.getElementById('landing-view'),
  mainHeader: document.getElementById('main-header'),
  platformTag: document.getElementById('platform-tag'),
  difficultyTag: document.getElementById('difficulty-tag'),
  statusUrl: document.getElementById('status-url'),
  academyProgress: document.getElementById('academy-progress'),
  moduleCard: document.getElementById('current-module-card'),
  btnUnderstood: document.getElementById('btn-understood'),
  btnStartChallenge: document.getElementById('btn-start-challenge'),
  stepIndicator: document.getElementById('step-indicator'),
  btnEnterRoom: document.getElementById('btn-enter-room'),
  scenarioContainer: document.getElementById('scenario-container')
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
  
  if (state.lives === 1) {
    elements.lives.classList.add('critical-threat');
  } else {
    elements.lives.classList.remove('critical-threat');
  }
  
  // Advanced Meta
  elements.platformTag.textContent = scenario.platform;
  elements.difficultyTag.textContent = scenario.difficulty;
  elements.difficultyTag.className = `difficulty-tag ${scenario.difficulty}`;
  
  // Animation reset
  const scenarioContainer = document.getElementById('scenario-container');
  scenarioContainer.classList.remove('animate-fade');
  void scenarioContainer.offsetWidth; // trigger reflow
  scenarioContainer.classList.add('animate-fade');

  // Link Hover Logic
  setupLinkInspection();

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

function setupLinkInspection() {
  const links = elements.body.querySelectorAll('.simulated-link');
  elements.statusUrl.textContent = 'Hover over a link to inspect URL...';
  
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      elements.statusUrl.textContent = link.dataset.url;
      elements.statusUrl.style.color = 'var(--accent)';
    });
    link.addEventListener('mouseleave', () => {
      elements.statusUrl.textContent = 'Hover over a link to inspect URL...';
      elements.statusUrl.style.color = 'var(--text-muted)';
    });
  });
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
  // Hide all
  elements.landingView.style.display = 'none';
  elements.academyView.style.display = 'none';
  elements.gameView.style.display = 'none';
  elements.mainHeader.style.display = 'none';

  if (view === 'landing') {
    elements.landingView.style.display = 'grid';
    elements.navLanding?.classList.add('active');
    elements.navAcademy.classList.remove('active');
    elements.navGame.classList.remove('active');
  } else if (view === 'academy') {
    elements.mainHeader.style.display = 'flex';
    elements.academyView.style.display = 'block';
    elements.navGame.classList.remove('active');
    elements.navAcademy.classList.add('active');
    updateLearningRoom();
  } else if (view === 'game') {
    if (!state.gameUnlocked) {
      alert("⚠️ Access Denied: You must complete the Learning Room to unlock the Challenge!");
      return;
    }
    elements.mainHeader.style.display = 'flex';
    elements.gameView.style.display = 'grid';
    elements.scenarioContainer.style.display = 'flex';
    elements.navGame.classList.add('active');
    elements.navAcademy.classList.remove('active');
  }
}

function updateLearningRoom() {
  const module = academyModules[state.currentModuleIndex];
  elements.moduleCard.innerHTML = `
    <div class="category-tag">${module.tag}</div>
    <h3>${module.title}</h3>
    <div class="module-content">${module.content}</div>
  `;
  
  const total = academyModules.length;
  const progress = ((state.currentModuleIndex) / total) * 100;
  elements.academyProgress.style.width = `${progress}%`;
  elements.stepIndicator.textContent = `Teaching ${state.currentModuleIndex + 1} of ${total}`;

  if (state.currentModuleIndex === total - 1) {
    elements.btnUnderstood.textContent = 'I have Mastered the Basics';
  }
}

function handleNextTeaching() {
  if (state.currentModuleIndex < academyModules.length - 1) {
    state.currentModuleIndex++;
    updateLearningRoom();
  } else {
    // Learning over
    state.gameUnlocked = true;
    elements.academyProgress.style.width = '100%';
    elements.btnUnderstood.style.display = 'none';
    elements.btnStartChallenge.style.display = 'flex';
    elements.navGame.classList.remove('disabled');
    elements.navGame.title = 'Challenge Unlocked!';
  }
}

// Event Listeners
elements.btnReport.addEventListener('click', () => handleDecision(true));
elements.btnTrust.addEventListener('click', () => handleDecision(false));
elements.btnNext.addEventListener('click', nextScenario);
elements.navGame.addEventListener('click', () => switchView('game'));
elements.navAcademy.addEventListener('click', () => switchView('academy'));
elements.navLanding.addEventListener('click', () => switchView('landing'));
elements.btnEnterRoom.addEventListener('click', () => switchView('academy'));
elements.btnUnderstood.addEventListener('click', handleNextTeaching);
elements.btnStartChallenge.addEventListener('click', () => switchView('game'));

// Initialize
switchView('landing');
updateUI();
