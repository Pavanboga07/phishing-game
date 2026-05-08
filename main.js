import './style.css';

// Game Scenarios - Expanded Library
const scenarios = [
  {
    id: 1,
    platform: 'Email',
    sender: 'security@microsoft-verify.com',
    subject: 'Action Required: Unusual Sign-in Activity',
    body: `
      <p>Dear User,</p>
      <p>We detected an unusual sign-in attempt from a new location (Moscow, RU). If this was not you, please verify your account immediately to prevent unauthorized access.</p>
      <div class="email-cta" style="margin: 20px 0; text-align: center;">
        <a href="#" class="simulated-link" data-url="https://microsoft-login.secure-verify.net/reset-auth" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Verify My Account Now</a>
      </div>
      <p>Failure to verify within 24 hours will result in permanent account suspension.</p>
    `,
    isPhishing: true,
    difficulty: 'Easy',
    explanation: 'The sender domain "microsoft-verify.com" is not an official Microsoft domain. Official emails come from @microsoft.com.',
    redFlags: ['Urgent tone', 'Suspicious domain name', 'Threat of account suspension']
  },
  {
    id: 2,
    platform: 'SMS',
    sender: '+91 98210 54122',
    subject: 'Urgent: Bank Alert',
    body: `
      <div class="sms-bubble">
        [HDFC] Your account has been temporarily blocked due to KYC non-compliance. Click here to update now: <a href="#" class="simulated-link" data-url="https://hdfc.net-kyc.in/portal">hdfc.net-kyc.in/portal</a>
      </div>
    `,
    isPhishing: true,
    difficulty: 'Medium',
    explanation: 'Banks never send KYC update links via SMS. Official domains would end in .com or .in, but the full domain hdfc.net-kyc.in is a lookalike.',
    redFlags: ['Suspicious sender number', 'Lookalike domain', 'Artificial urgency']
  },
  {
    id: 3,
    platform: 'Social',
    sender: 'LinkedIn Security',
    subject: 'New Message from Recruiter',
    body: `
      <div class="social-post">
        <p>Hi there! I saw your profile and we have a high-paying role at Nexus. Please check the job description here:</p>
        <div class="social-attachment">
          📄 <a href="#" class="simulated-link" data-url="https://linkedin-jobs.files-share.com/JD_Nexus_2026.pdf.exe">JD_Nexus_2026.pdf</a>
        </div>
      </div>
    `,
    isPhishing: true,
    difficulty: 'Medium',
    explanation: 'The attachment ends in .exe, which is an executable file, not a PDF. Attackers hide malware in fake documents.',
    redFlags: ['Double file extension (.pdf.exe)', 'Suspicious file sharing domain']
  },
  {
    id: 4,
    platform: 'Email',
    sender: 'it-support@nexus-corp.com',
    subject: 'Scheduled Password Rotation',
    body: `
      <p>Team,</p>
      <p>As per our quarterly security policy, please rotate your domain password by EOD. Use the internal portal only.</p>
      <div class="email-cta">
        <a href="#" class="simulated-link" data-url="https://portal.nexus-corp.com/security/reset">Access Internal Portal</a>
      </div>
    `,
    isPhishing: false,
    difficulty: 'Easy',
    explanation: 'This is a legitimate internal communication. The sender domain matches the company, and the URL is the official internal portal.',
    redFlags: []
  },
  {
    id: 5,
    platform: 'WhatsApp',
    sender: 'Family (Mom)',
    subject: 'New Phone Number',
    body: `
      <div class="sms-bubble">
        Hi beta, my old phone broke. This is my new number. Can you please pay this small bill for me? I'll return it tomorrow. <a href="#" class="simulated-link" data-url="https://pay-nexus.in/quick-transfer">pay-nexus.in/quick-transfer</a>
      </div>
    `,
    isPhishing: true,
    difficulty: 'Hard',
    explanation: 'This is "Family Impersonation" or "Hi Mum" scam. Attackers pose as loved ones in distress to bypass your guard.',
    redFlags: ['Unexpected request for money', 'New/unknown number', 'Sense of urgency']
  },
  {
    id: 6,
    platform: 'Email',
    sender: 'accounts@netflix-offers.com',
    subject: 'Payment Declined: Update your Netflix Membership',
    body: `
      <p>We're having some trouble with your current billing information.</p>
      <p>Please update your payment method to continue watching.</p>
      <a href="#" class="simulated-link" data-url="https://netflix.update-billing.com/signin">Update Payment</a>
    `,
    isPhishing: true,
    difficulty: 'Medium',
    explanation: 'The domain "netflix-offers.com" is suspicious. Real Netflix emails come from @netflix.com.',
    redFlags: ['Suspicious domain', 'Financial lure']
  },
  {
    id: 7,
    platform: 'LinkedIn',
    sender: 'HR at Google',
    subject: 'Interview Invitation',
    body: `
      <p>Congratulations! You have been shortlisted for an interview. Please join the secure meeting portal to begin:</p>
      <a href="#" class="simulated-link" data-url="https://google.zoom-interview.com/j/992102">Join Meeting</a>
    `,
    isPhishing: true,
    difficulty: 'Hard',
    explanation: 'Lookalike domain: "google.zoom-interview.com". Attackers often use subdomains to hide the real malicious domain.',
    redFlags: ['Subdomain trickery', 'High-value lure']
  },
  {
    id: 8,
    platform: 'Email',
    sender: 'hr@nexus-corp.com',
    subject: 'Annual Employee Survey 2026',
    body: `
      <p>Hello Team,</p>
      <p>Please take 5 minutes to share your feedback on our workplace culture. Your responses are anonymous.</p>
      <a href="#" class="simulated-link" data-url="https://surveys.nexus-corp.com/culture-2026">Take Survey</a>
    `,
    isPhishing: false,
    difficulty: 'Medium',
    explanation: 'Legitimate internal survey. The domain and URL structure align with corporate standards.',
    redFlags: []
  },
  {
    id: 9,
    platform: 'QR Code',
    sender: 'Parking Garage',
    subject: 'Scan to Pay',
    body: `
      <div style="text-align: center;">
        <p>Pay your parking fee by scanning the code below:</p>
        <div style="width: 150px; height: 150px; background: #eee; margin: 1rem auto; display: flex; align-items: center; justify-content: center; border: 2px dashed #999;">
          [QR CODE]
        </div>
        <a href="#" class="simulated-link" data-url="https://parking-pay.quick-scan.net/id=882">Scan Link Result</a>
      </div>
    `,
    isPhishing: true,
    difficulty: 'Hard',
    explanation: '"Quishing" (QR Phishing). Attackers paste fake QR codes over real ones to steal payment info.',
    redFlags: ['Generic payment domain', 'Unverified physical QR placement']
  },
  {
    id: 10,
    platform: 'Email',
    sender: 'billing@apple.com',
    subject: 'Receipt for your recent purchase',
    body: `
      <p>Your subscription for iCloud+ has been renewed.</p>
      <p>Amount: ₹75.00</p>
      <p>If you did not authorize this, view the full receipt here: <a href="#" class="simulated-link" data-url="https://www.apple.com/account/purchases">View Receipt</a></p>
    `,
    isPhishing: false,
    difficulty: 'Easy',
    explanation: 'Official Apple receipt format. Link leads to the legitimate Apple account page.',
    redFlags: []
  },
  {
    id: 11,
    platform: 'Slack',
    sender: 'System Admin',
    subject: 'Security Token Update',
    body: `
      <div class="social-post">
        <p>⚠️ Your Slack auth token will expire in 10 minutes. Click below to refresh and prevent logout.</p>
        <a href="#" class="simulated-link" data-url="https://slack-security.app-auth.io/refresh">Refresh Token</a>
      </div>
    `,
    isPhishing: true,
    difficulty: 'Hard',
    explanation: 'Collaboration tool phishing. Attackers use Slack or Teams to target employees with high urgency.',
    redFlags: ['Extreme urgency', 'Third-party auth domain']
  },
  {
    id: 12,
    platform: 'Email',
    sender: 'no-reply@amazon.in',
    subject: 'Your order #882-1029-551 has been shipped',
    body: `
      <p>Hi customer,</p>
      <p>Your package is on its way. Track your delivery status here:</p>
      <a href="#" class="simulated-link" data-url="https://www.amazon.in/gp/your-account/order-history">Track Package</a>
    `,
    isPhishing: false,
    difficulty: 'Easy',
    explanation: 'Legitimate order confirmation. The URL points to the official Amazon order history page.',
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
  },
  {
    id: 'mfa',
    tag: 'Advanced',
    title: 'The MFA Shield',
    content: '<p>Multi-Factor Authentication (MFA) is your last line of defense. Even if an attacker steals your password, they cannot access your account without your secondary device.</p><div class="learning-tip">🚨 Never share your OTP with anyone, including bank officials.</div>'
  },
  {
    id: 'social-eng',
    tag: 'Psychology',
    title: 'Social Engineering',
    content: '<p>Attackers dont just hack systems; they hack people. They use emotions like fear, curiosity, or greed to manipulate you into making mistakes.</p><ul class="learning-list"><li>🎭 <strong>Authority:</strong> Posing as your boss or CEO.</li><li>🎁 <strong>Greed:</strong> Fake lottery or high-paying job offers.</li></ul>'
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
    elements.navLanding.classList.remove('active');
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
    elements.navLanding.classList.remove('active');
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
