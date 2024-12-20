import { Module } from '@nestjs/common';
import { ChatgptController } from './chatgpt/chatgpt.controller';
import { ChatgptService } from './chatgpt/chatgpt.service';

@Module({
  imports: [],
  controllers: [ChatgptController],
  providers: [ChatgptService],
})
export class AppModule {}