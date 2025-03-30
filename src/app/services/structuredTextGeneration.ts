import { OpenAIService } from './openAI';

type FieldDefinition = {
  id: string;
  placeholder?: string | string[];
  type?: 'string' | 'string[]' | 'number' | 'number[]' | 'boolean' | 'boolean[]';
};

type FieldValue = string | string[] | number | number[] | boolean | boolean[];

type GenerateOptions = {
  temperature?: number;
  additionalRules?: string[];
};

export class StructuredTextGenerationService {
  private readonly openAIService: OpenAIService;

  constructor(openAIService: OpenAIService = new OpenAIService()) {
    this.openAIService = openAIService;
  }

  async generateStructuredText<T extends Record<string, FieldValue>>(
    fields: FieldDefinition[],
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<T | null> {
    if (!fields.length || !prompt) return null;

    try {
      const requiredKeys = fields.map(field => field.id);
      const exampleResponse = Object.fromEntries(
        fields.map(field => [
          field.id,
          field.placeholder ||
            (() => {
              switch (field.type) {
                case 'string[]':
                  return [`[${field.id}]`];
                case 'number':
                  return 42;
                case 'number[]':
                  return [1, 2, 3];
                case 'boolean':
                  return true;
                default:
                  return `[${field.id}]`;
              }
            })(),
        ])
      );

      const rules = [
        'Respond ONLY with a valid JSON object',
        `The JSON object should contain EXACTLY these keys: ${requiredKeys.join(', ')}`,
        'Each value should match its field type EXACTLY as specified:',
        '- string: a single text string (not an array)',
        '- string[]: an array of text strings (e.g. ["text1", "text2"])',
        '- number: a single numeric value (not an array)',
        '- number[]: an array of numeric values (e.g. [1, 2, 3])',
        '- boolean: true or false (not an array)',
        '- boolean[]: an array of true/false values (e.g. [true, false])',
        'DO NOT convert single values to arrays unless the type explicitly ends with []',
        'DO NOT convert arrays to single values unless the type is a single string/number/boolean',
        'DO NOT include any other text, markdown, explanations, or formatting',
        'DO NOT use code blocks or backticks',
        'DO NOT include emojis or special characters that could break JSON parsing',
        ...(options.additionalRules || []),
      ];

      const systemMessage = `You universal API responder. Your ONLY role is to generate json reponse in a specific format.
        RESPONSE RULES:
        ${rules.map((rule, i) => `${i + 1}. ${rule}`).join('\n')}
        Example valid response:
        ${JSON.stringify(exampleResponse, null, 2)}
      `;

      const response = await this.openAIService.chat(prompt, {
        systemMessage,
        temperature: options.temperature ?? 0.7,
      });

      if (response?.content) {
        try {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const generatedTexts = JSON.parse(jsonStr) as T;

            const hasValidKeys = requiredKeys.every(key => {
              const field = fields.find(f => f.id === key);
              const value = generatedTexts[key];
              const type = field?.type || 'string'; // Default to 'string' if type is not specified

              // Helper function to validate array types
              const isValidArray = (
                arr: unknown,
                itemType: 'string' | 'number' | 'boolean'
              ): boolean => {
                return Array.isArray(arr) && arr.every(item => typeof item === itemType);
              };

              switch (type) {
                case 'string[]':
                  return isValidArray(value, 'string');
                case 'number[]':
                  return isValidArray(value, 'number');
                case 'boolean[]':
                  return isValidArray(value, 'boolean');
                case 'string':
                  return typeof value === 'string';
                case 'number':
                  return typeof value === 'number';
                case 'boolean':
                  return typeof value === 'boolean';
                default:
                  return false;
              }
            });

            if (hasValidKeys) {
              return generatedTexts;
            }

            // Add more detailed error information
            const invalidKeys = requiredKeys
              .filter(key => {
                const field = fields.find(f => f.id === key);
                const value = generatedTexts[key];
                const type = field?.type || 'string';

                const isValidArray = (
                  arr: unknown,
                  itemType: 'string' | 'number' | 'boolean'
                ): boolean => {
                  return Array.isArray(arr) && arr.every(item => typeof item === itemType);
                };

                switch (type) {
                  case 'string[]':
                    return !isValidArray(value, 'string');
                  case 'number[]':
                    return !isValidArray(value, 'number');
                  case 'boolean[]':
                    return !isValidArray(value, 'boolean');
                  case 'string':
                    return typeof value !== 'string';
                  case 'number':
                    return typeof value !== 'number';
                  case 'boolean':
                    return typeof value !== 'boolean';
                  default:
                    return true;
                }
              })
              .map(key => {
                const field = fields.find(f => f.id === key);
                const value = generatedTexts[key];
                return `${key} (expected ${field?.type || 'string'}, got ${Array.isArray(value) ? 'array' : typeof value})`;
              });

            throw new Error(
              `Generated text has invalid types for keys: ${invalidKeys.join(', ')}. Full response: ${jsonStr}`
            );
          } else {
            throw new Error('No JSON object found in response');
          }
        } catch (error) {
          throw new Error(
            'Failed to parse AI response: ' +
              (error instanceof Error ? error.message : 'Unknown error')
          );
        }
      }
      throw new Error('No response content received from AI');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      throw new Error(errorMessage);
    }
  }
}

// Create a singleton instance with default configuration
export const structuredTextGenerationService = new StructuredTextGenerationService();
