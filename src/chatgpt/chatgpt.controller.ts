import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatgptService } from './chatgpt.service';


@Controller()
export class ChatgptController {
  private readonly logger = new Logger(ChatgptController.name);

    constructor(private readonly chatgptService: ChatgptService) {
        this.logger.log('GPT controller connected!')
    }

    @MessagePattern('quiz')
    async generateText(@Payload() prompt: string): Promise<string> {
      this.logger.log(`Received request for text generation with prompt: ${prompt}`);
        try {
            let response = await this.chatgptService.generateText(prompt);
            response = response.replaceAll("```json", "").replaceAll("```", "")
            const json = JSON.parse(response);
            if (json.quality <= 0.5) {
                delete json.nextQuestion
                delete json.rightAnswear
                json.fail = true
            } 
            if (json.quality >= 0.9) {
                delete json.nextQuestion
                delete json.rightAnswear
                json.done = true
            }
            this.logger.log(`Generated text: ${json}`);
            return json;
        } catch(error){
            this.logger.error(`Failed to generate text. Error: ${error.message}`)
             return "Failed"
        }
    }

    @MessagePattern('ping')
    async handlePing(@Payload() message: any): Promise<string> {
        this.logger.log(`Received ping with message: ${JSON.stringify(message)}`);
        return "pong"
    }
}