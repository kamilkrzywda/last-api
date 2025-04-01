interface ChatOptions {
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  responseFormat?: 'text' | 'json_object';
  tools?: Array<{
    type: string;
    function: {
      name: string;
      description?: string;
      parameters: Record<string, unknown>;
    };
  }>;
  toolChoice?: string | { type: string; function: { name: string } };
}

export const DEFAULT_TIMEOUT = 30000; // 30 seconds

export class AIProxyService {
  private readonly baseURL: string;

  constructor(baseURL: string = '/api/ai') {
    this.baseURL = baseURL;
  }

  async chat(userMessage: string, options: ChatOptions = {}) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              'Request timed out after ' +
                (options.timeoutMs || DEFAULT_TIMEOUT) / 1000 +
                ' seconds'
            )
          );
        }, options.timeoutMs || DEFAULT_TIMEOUT);
      });

      const fetchPromise = fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          options: {
            systemMessage: options.systemMessage,
            temperature: options.temperature,
            maxTokens: options.maxTokens,
            responseFormat: options.responseFormat,
            tools: options.tools,
            toolChoice: options.toolChoice,
          },
        }),
      });

      let response: Response;
      try {
        response = (await Promise.race([fetchPromise, timeoutPromise])) as Response;
      } catch {
        throw new Error('Failed to connect to AI service. API might be offline.');
      }

      if (!response.ok) {
        throw new Error(
          `Failed to get response from AI service: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error(result.error as string);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      throw new Error(errorMessage);
    }
  }
}

// Create a singleton instance with default configuration
export const aiProxyService = new AIProxyService();
