export const INTENTS = [
  // Navigation & Linking
  { keywords: ['register', 'signup', 'new athlete', 'add athlete', 'பதிவு', 'coach'], 
    response: 'I can help with athlete registration. Head over to the registration portal:',
    link: { label: 'Register Athlete 📝', target: '/register' } },
  { keywords: ['assess', 'test', 'timer', 'record', 'measure', 'பரிசோதனை'], 
    response: 'To record a new score, open the Assessment module:',
    link: { label: 'Start Assessment ⏱️', target: '/assess' } },
  { keywords: ['scout', 'search', 'find', 'discover', 'talent', 'தேடு', 'heatmap'], 
    response: 'Discovering verified talent across Tamil Nadu. Access the Scout Feed:',
    link: { label: 'Scout Dashboard 🔍', target: '/scout' } },
  { keywords: ['profile', 'my profile', 'passport', 'senpass', 'சுயவிவரம்', 'id'], 
    response: 'View your digital identity and test records in the SenPass profile:',
    link: { label: 'View Profile 👤', target: '/profile/user' } },
  { keywords: ['scheme', 'scholarship', 'fund', 'money', 'grant', 'உதவித்தொகை'], 
    response: 'Check which government scholarships and sports schemes you qualify for in your profile:',
    link: { label: 'Check Schemes 💰', target: '/profile/user' } },
  { keywords: ['setting', 'language', 'tamil', 'english', 'அமைப்பு'], 
    response: 'You can change your language and manage local offline data here:',
    link: { label: 'Open Settings ⚙️', target: '/settings' } },
  
  // Real Coaching Logic & Q/A
  { keywords: ['diet', 'nutrition', 'eat', 'meal', 'food', 'சாப்பாடு'], 
    response: 'Coaching Tip: For match days, consume complex carbs (oats, brown rice) 3-4 hours prior, and a light snack (banana, energy bar) 45 mins before.' },
  { keywords: ['sprint', 'run fastest', 'speed', 'acceleration', 'ஓட்டம்'],
    response: 'Coaching Tip: To improve sprint times, focus on explosive plyometrics (box jumps) and heavy sled pushes. Ensure your arm drive matches your knee lift.' },
  { keywords: ['stamina', 'endurance', 'tired', 'மூச்சு'],
    response: 'Coaching Tip: Build base endurance with Zone 2 cardio (60-70% max heart rate) for 45+ mins. Mix in HIIT sessions twice a week to boost your VO2 Max.' },
  
  // Queries
  { keywords: ['what is', 'explain', 'how to guide', 'உதவி'], 
    response: 'SENTRAK is a digital talent discovery platform using SHA-256 for tamper-proof grassroot scouting. I can guide you to tests or schemes.' },
  { keywords: ['rating', 'score', 'talent', 'rank', 'தரம்'], 
    response: 'Talent Ratings range from 1000 to 2500+ (Tier S). Ratings are computed dynamically based on your verified performance percentiles and mental assessment.' },
  { keywords: ['tops', 'target olympic', 'khelo india'], 
    response: 'TOPS is the Target Olympic Podium Scheme by the Ministry of Youth Affairs and Sports. SENTRAK automatically shortlists elite performers for this pipeline.' },
  
  // Greetings
  { keywords: ['hi', 'hello', 'hey', 'vanakkam', 'வணக்கம்', 'bot'], 
    response: 'Vanakkam! 🙏 I am SenBot, your AI Sports Assistant. Try asking about "nutrition", "how many athletes", or ask me to "open rankings".' },
];

export function classifyIntent(input, context = {}) {
  const lower = input.toLowerCase().trim();
  if (!lower) return null;

  // 1. Contextual Overrides
  if (context.path?.includes('/assess') && lower.includes('help')) {
    return { response: 'You are on the Assessment page. Enter scores for each physical or sport-specific metric. Missing or red values mean the score needs improvement.' };
  }
  if (context.path?.includes('/scout') && lower.includes('help')) {
    return { response: 'The Scout Dashboard lets you filter verified talent. Click on a district hex in the Heat Map to filter the feed instantly.' };
  }

  // 2. Dynamic Query Handlers
  if (lower.includes('how many') || lower.includes('count') || lower.includes('total athletes')) {
      const c = context.athletesCount || 'thousands of';
      return { response: `We currently have ${c} athletes securely registered on SENTRAK.` };
  }
  if (lower.includes('offline') || lower.includes('sync') || lower.includes('internet')) {
      return { response: context.isOnline 
        ? 'You are currently 🟢 ONLINE. Data is securely syncing to the cloud.'
        : 'You are currently 🔴 OFFLINE. Data is saving to safe local storage and will sync automatically when connection restores.'
      };
  }

  // 3. Static Matching
  for (const intent of INTENTS) {
    if (intent.keywords.some(k => lower.includes(k))) return intent;
  }
  
  return { 
    response: 'I am not sure about that. Try changing settings, ask about "endurance", or find "how many athletes we have".' 
  };
}
