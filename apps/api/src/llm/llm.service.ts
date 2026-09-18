import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
@Injectable()
export class LlmService {
  private readonly client: OpenAI;
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.LLM_API_KEY,
      baseURL: process.env.LLM_API_BASE_URL,
    });
  }
  async chat(content: string) {
    try {
      const response =  await this.client.chat.completions.create({
        model: process.env.LLM_MODEL as string,
        messages: [
          {
            role: 'user',
            content: content,
          },
        ],
      });
      return response.choices[0].message.content;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('LLM failed');
    }
  }
}
