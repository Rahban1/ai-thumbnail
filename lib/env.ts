/**
 * Environment variable validation and configuration
 * This ensures all required environment variables are present at runtime
 */

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env.local file or deployment environment variables.`
    );
  }
  
  return value;
}

function validateEnvVars() {
  const required = ['GEMINI_API_KEY', 'OPENAI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env.local file or deployment configuration.`
    );
  }
}

// Validate environment variables on module load
validateEnvVars();

export const env = {
  GEMINI_API_KEY: getEnvVar('GEMINI_API_KEY'),
  OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

export default env;