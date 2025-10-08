import { TranslationCandidate, TranslationLayer, PersonalityProfile } from '../types';

export const generateMockTranslations = async (
  originalText: string, 
  userProfile?: PersonalityProfile
): Promise<TranslationCandidate[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock AI translation logic - in a real app this would call an AI service
  const translations: TranslationCandidate[] = [];
  
  // Emotion layer translation
  translations.push({
    id: 'emotion',
    text: generateEmotionTranslation(originalText),
    layer: 'emotion',
    confidence: 0.9
  });
  
  // Fear layer translation
  translations.push({
    id: 'fear',
    text: generateFearTranslation(originalText),
    layer: 'fear',
    confidence: 0.85
  });
  
  // Longing layer translation
  translations.push({
    id: 'longing',
    text: generateLongingTranslation(originalText),
    layer: 'longing',
    confidence: 0.88
  });
  
  return translations;
};

const generateEmotionTranslation = (text: string): string => {
  const emotionPatterns = [
    "I'm feeling overwhelmed and need some space to process what happened between us.",
    "I'm experiencing a lot of emotions right now and want to communicate clearly with you.",
    "I'm feeling hurt and would appreciate your understanding while I work through this.",
    "I'm struggling with these feelings and need your patience as we figure this out together."
  ];
  
  return emotionPatterns[Math.floor(Math.random() * emotionPatterns.length)];
};

const generateFearTranslation = (text: string): string => {
  const fearPatterns = [
    "I'm scared that if we keep fighting like this, we might lose what we have.",
    "I'm worried that my words might push you away when that's the last thing I want.",
    "I'm afraid we're not understanding each other and it's creating distance between us.",
    "I'm concerned that this conflict might damage our relationship permanently."
  ];
  
  return fearPatterns[Math.floor(Math.random() * fearPatterns.length)];
};

const generateLongingTranslation = (text: string): string => {
  const longingPatterns = [
    "What I really want is to feel heard and understood by you.",
    "I'm hoping we can find a way to connect and work through this together.",
    "I long for us to have the kind of communication where we both feel safe.",
    "What I'm seeking is a deeper understanding between us, not to be right."
  ];
  
  return longingPatterns[Math.floor(Math.random() * longingPatterns.length)];
};

export const personalizeTranslation = (
  translation: TranslationCandidate,
  userProfile: PersonalityProfile
): TranslationCandidate => {
  // Adjust translation based on user's personality profile
  let personalizedText = translation.text;
  
  const topBucket = Object.entries(userProfile.buckets)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Adjust tone based on dominant personality bucket
  switch (topBucket) {
    case 'feeling':
      personalizedText = makeMoreEmotional(personalizedText);
      break;
    case 'thinking':
      personalizedText = makeMoreAnalytical(personalizedText);
      break;
    case 'sensing':
      personalizedText = makeMoreConcrete(personalizedText);
      break;
    case 'intuition':
      personalizedText = makeMoreConceptual(personalizedText);
      break;
  }
  
  return {
    ...translation,
    text: personalizedText
  };
};

const makeMoreEmotional = (text: string): string => {
  return text.replace(/I think/g, 'I feel')
              .replace(/It seems/g, 'It feels like');
};

const makeMoreAnalytical = (text: string): string => {
  return text.replace(/I feel/g, 'I think')
              .replace(/It feels like/g, 'It appears that');
};

const makeMoreConcrete = (text: string): string => {
  return text.replace(/in general/g, 'specifically')
              .replace(/usually/g, 'in this situation');
};

const makeMoreConceptual = (text: string): string => {
  return text.replace(/specifically/g, 'in the bigger picture')
              .replace(/right now/g, 'as part of our overall pattern');
};
