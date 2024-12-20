import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

@Injectable()
export class ChatgptService {
    private readonly logger = new Logger(ChatgptService.name);

    private openai: OpenAI;
    private googleai: GoogleGenerativeAI;
    private googleAIModel: any;

    constructor() {
        this.googleai = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
        this.googleAIModel = this.googleai.getGenerativeModel({model: 'gemini-1.5-flash'})

        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        if(!process.env.OPENAI_API_KEY) {
            this.logger.error('OpenAI API key is not defined in the environment variable')
            throw new Error('OpenAI API key is not defined in the environment variable')
        }
        this.logger.log('GPT service started successfully!')
    }

    async generateText(prompt: string): Promise<string> {
        try {
            // const completion = await this.openai.chat.completions.create({
            //     messages: [{ role: 'user', content: prompt }, {role: 'system', content: process.env.CHARACTER}],
            //     model: process.env.GPTMODEL,
            // });
            // return completion.choices[0]?.message?.content;
            const comp = await this.googleAIModel.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                systemInstruction: {
                    "role": "system",
                    "parts": [
                        {
                            "text": process.env.CHARACTER
                        }
                    ]
                },
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 1,
                },
            });
            return comp.response.text()
        } catch (error) {
            this.logger.error('Error generating text:', error); 
            throw new Error(`Failed to generate text: ${error.message}`);
        }
    }
}