import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { RoomsController } from './chat/rooms.controller';
import { ChatWebsocketGateway } from './chat/chat.websocket.gateway';

@Module({
  imports: [ChatModule],
  controllers: [RoomsController],
  providers: [ChatWebsocketGateway],
})
export class AppModule {}
