import OpenAI from "openai";

/**
 * Creates an OpenAI client instance using either the server environment variable
 * or a user-provided client API key.
 */
export function getOpenAIClient(clientApiKey?: string): OpenAI | null {
  const apiKey = clientApiKey || process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "your_openai_api_key_here") {
    return null;
  }

  return new OpenAI({
    apiKey: apiKey,
  });
}
