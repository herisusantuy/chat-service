import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RoomsController } from './rooms.controller';

@Module({
  providers: [ChatService],
  controllers: [RoomsController],
})
export class ChatModule {}
