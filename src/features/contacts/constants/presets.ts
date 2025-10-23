import { ContactSliders } from '../api/contactsClient';

// System default presets for relationship types
export const RELATIONSHIP_PRESETS: Record<string, Omit<ContactSliders, 'contact_id'>> = {
  'Partner': {
    // Core sliders
    directness: 70,
    formality: 20,
    warmth: 90,
    support: 60,
    humor: 70,
    teasing: 60,
    // Advanced sliders
    listening_style: 40,
    response_timing: 30,
    emotional_expression: 85,
    problem_depth: 70,
    accountability: 60,
    reassurance_level: 70,
    conversation_initiation: 70,
    vulnerability: 85,
    feedback_style: 50,
  },
  'Spouse': {
    // Same as Partner
    directness: 70,
    formality: 20,
    warmth: 90,
    support: 60,
    humor: 70,
    teasing: 60,
    listening_style: 40,
    response_timing: 30,
    emotional_expression: 85,
    problem_depth: 70,
    accountability: 60,
    reassurance_level: 70,
    conversation_initiation: 70,
    vulnerability: 85,
    feedback_style: 50,
  },
  'Friend': {
    directness: 60,
    formality: 30,
    warmth: 70,
    support: 50,
    humor: 75,
    teasing: 55,
    listening_style: 45,
    response_timing: 40,
    emotional_expression: 65,
    problem_depth: 55,
    accountability: 50,
    reassurance_level: 55,
    conversation_initiation: 55,
    vulnerability: 60,
    feedback_style: 55,
  },
  'Best Friend': {
    directness: 75,
    formality: 15,
    warmth: 85,
    support: 55,
    humor: 80,
    teasing: 70,
    listening_style: 35,
    response_timing: 25,
    emotional_expression: 80,
    problem_depth: 75,
    accountability: 65,
    reassurance_level: 65,
    conversation_initiation: 65,
    vulnerability: 80,
    feedback_style: 70,
  },
  'Family': {
    directness: 55,
    formality: 25,
    warmth: 80,
    support: 65,
    humor: 60,
    teasing: 45,
    listening_style: 35,
    response_timing: 40,
    emotional_expression: 70,
    problem_depth: 60,
    accountability: 50,
    reassurance_level: 75,
    conversation_initiation: 60,
    vulnerability: 65,
    feedback_style: 45,
  },
  'Boss': {
    directness: 70,
    formality: 80,
    warmth: 35,
    support: 70,
    humor: 25,
    teasing: 10,
    listening_style: 60,
    response_timing: 60,
    emotional_expression: 30,
    problem_depth: 70,
    accountability: 75,
    reassurance_level: 40,
    conversation_initiation: 40,
    vulnerability: 20,
    feedback_style: 65,
  },
  'Colleague': {
    directness: 65,
    formality: 65,
    warmth: 50,
    support: 60,
    humor: 45,
    teasing: 25,
    listening_style: 55,
    response_timing: 50,
    emotional_expression: 40,
    problem_depth: 60,
    accountability: 65,
    reassurance_level: 45,
    conversation_initiation: 50,
    vulnerability: 35,
    feedback_style: 60,
  },
  'Acquaintance': {
    directness: 40,
    formality: 70,
    warmth: 45,
    support: 45,
    humor: 35,
    teasing: 15,
    listening_style: 50,
    response_timing: 55,
    emotional_expression: 30,
    problem_depth: 30,
    accountability: 40,
    reassurance_level: 40,
    conversation_initiation: 35,
    vulnerability: 25,
    feedback_style: 40,
  },
  'Other': {
    // Neutral defaults - all 50
    directness: 50,
    formality: 50,
    warmth: 50,
    support: 50,
    humor: 50,
    teasing: 50,
    listening_style: 50,
    response_timing: 50,
    emotional_expression: 50,
    problem_depth: 50,
    accountability: 50,
    reassurance_level: 50,
    conversation_initiation: 50,
    vulnerability: 50,
    feedback_style: 50,
  },
};

/**
 * Get preset slider values for a relationship type
 * @param relationshipType - The type of relationship (e.g., 'Partner', 'Friend')
 * @returns Preset slider values or null if not found
 */
export function getPresetForType(relationshipType: string): Omit<ContactSliders, 'contact_id'> | null {
  const preset = RELATIONSHIP_PRESETS[relationshipType];
  if (preset) {
    return preset;
  }
  
  // Fallback to 'Other' if type not found
  return RELATIONSHIP_PRESETS['Other'];
}

/**
 * Check if sliders have been customized from defaults (not all 50)
 * @param sliders - Current slider values
 * @returns true if any slider is not 50
 */
export function hasCustomValues(sliders: Partial<ContactSliders> | null): boolean {
  if (!sliders) return false;
  
  const sliderKeys = Object.keys(sliders).filter(key => key !== 'contact_id');
  return sliderKeys.some(key => {
    const value = sliders[key as keyof ContactSliders];
    return typeof value === 'number' && value !== 50;
  });
}

