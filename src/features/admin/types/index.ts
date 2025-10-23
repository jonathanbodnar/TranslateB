/**
 * TypeScript types for Admin Panel
 */

export interface AdminConfig {
  config_id: string;
  payload: ConfigPayload;
  author_user_id: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ConfigPayload {
  cognitive: CognitiveConfig;
  fear: FearConfig;
  intake: IntakeConfig;
  translator: TranslatorConfig;
  share: ShareConfig;
  ui: UIConfig;
}

export interface CognitiveConfig {
  axis_weights: {
    N: number;
    S: number;
    T: number;
    F: number;
  };
  shadow_factor: number;
  trigger_threshold: number;
  blindspot_decay_rate: number;
}

export interface FearConfig {
  weights: {
    unworthiness: number;
    unlovability: number;
    powerlessness: number;
    unsafety: number;
  };
  recency_decay: {
    half_life_days: number;
  };
  heat_map_gradient: number[];
}

export interface IntakeConfig {
  flow: {
    min_cards: number;
    max_cards: number;
    summary_confirm_min_confidence: number;
  };
  intensity: {
    up: number;
    down: number;
    neither: number;
  };
  functions: {
    Se: number;
    Ne: number;
    Si: number;
    Ni: number;
    Te: number;
    Ti: number;
    Fe: number;
    Fi: number;
  };
}

export interface TranslatorConfig {
  default_mode: '4' | '8';
  enable_advanced: boolean;
}

export interface ShareConfig {
  card_templates: string[];
  public_wall_enabled: boolean;
}

export interface UIConfig {
  animation_speed_factor: number;
  bar_display_limit: number;
  theme_palette: string;
}

export interface ValidationError {
  path: string;
  message: string;
}

export interface UpdateConfigRequest {
  payload: ConfigPayload;
  notes?: string;
}

export interface UpdateConfigResponse extends AdminConfig {
  validation_errors?: ValidationError[];
}

export interface Question {
  id: string;
  headline: string;
  left_label: string;
  right_label: string;
  helper_text?: string | null;
  category: 'communication' | 'relationship' | 'personality' | 'fear';
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateQuestionRequest {
  id: string;
  headline: string;
  left_label: string;
  right_label: string;
  helper_text?: string;
  category: 'communication' | 'relationship' | 'personality' | 'fear';
  is_active: boolean;
}

export interface UpdateQuestionRequest {
  headline: string;
  left_label: string;
  right_label: string;
  helper_text?: string | null;
  category: 'communication' | 'relationship' | 'personality' | 'fear';
  is_active: boolean;
}

