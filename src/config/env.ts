import { z } from 'zod';

const envSchema = z.object({
  REACT_APP_API_BASE_URL: z.string().url().default('http://localhost:8080'),
  REACT_APP_SUPABASE_URL: z.string().url(),
  REACT_APP_SUPABASE_ANON_KEY: z.string().min(1),
  REACT_APP_NAME: z.string().default('TranslateB'),
  REACT_APP_VERSION: z.string().default('1.0.0'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err: z.ZodIssue) => err.path.join('.')).join(', ');
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}\n` +
        'Please check your .env file and ensure all required variables are set.'
      );
    }
    throw error;
  }
};

export const config = parseEnv();

export const {
  REACT_APP_API_BASE_URL: API_BASE_URL,
  REACT_APP_SUPABASE_URL: SUPABASE_URL,
  REACT_APP_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
  REACT_APP_NAME: APP_NAME,
  REACT_APP_VERSION: APP_VERSION,
} = config;
