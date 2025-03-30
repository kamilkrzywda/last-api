interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
}

export class GoogleAIService {
  private readonly baseURL: string;

  constructor(baseURL: string = '/api/ai') {
    this.baseURL = baseURL;
  }

  async chat(userMessage: string, options: ChatOptions = {}): Promise<string> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: 'gemini',
          message: userMessage,
          options: {
            temperature: options.temperature,
            maxTokens: options.maxTokens,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if ('error' in result) {
        throw new Error(result.error);
      }

      return result.content || '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      throw new Error(errorMessage);
    }
  }
}

// Create a singleton instance with default configuration
export const googleAIService = new GoogleAIService();
