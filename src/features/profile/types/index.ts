// Type definitions for ProfileService - matches backend interfaces

export interface CognitiveSnapshot {
  dominant_streams: string[];
  shadow_streams: string[];
  processing_tendencies: string[];
  blind_spots: string[];
  trigger_probability_index: number;
  communication_lens: {
    incoming: { N: number; S: number; T: number; F: number };
    outgoing: { N: number; S: number; T: number; F: number };
  };
}

export interface FearSnapshot {
  fears: Array<{ key: string; pct: number }>;
  heat_map: number[][];
  geometry: { cube: { x: number; y: number; z: number; d: number } };
  top3: string[];
}

export interface Insight {
  insight_id: string;
  type: 'trigger' | 'pattern' | 'breakthrough' | 'mirror';
  icon: string;
  title: string;
  snippet: string;
  ts: string;
  tags: string[];
  liked?: boolean;
}

export interface InsightsSnapshot {
  feed: Insight[];
  mirror_moments: number;
  inner_dialogue_replay: Array<{ script: string; reframe: string }>;
}

export interface ProfileSnapshot {
  user_id: string;
  cognitive_snapshot: CognitiveSnapshot;
  fear_snapshot: FearSnapshot;
  insights_snapshot: InsightsSnapshot;
  metadata: {
    generated_at: string;
    config_version: string;
  };
}

