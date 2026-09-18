import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
type LlmMessages = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};
@Injectable()
export class LlmService {
  private readonly client: OpenAI;
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.LLM_API_KEY,
      baseURL: process.env.LLM_API_BASE_URL,
    });
  }
  async chat(messages: LlmMessages[]) {
    try {
      const response = await this.client.chat.completions.create({
        model: process.env.LLM_MODEL as string,
        messages,
      });
      return response.choices[0].message.content;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('LLM failed');
    }
  }
}
