import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  Post,
  ForbiddenException,
  Body,
} from '@nestjs/common';
import { chatService } from './chat.service';
import { ChatWebsocketGateway } from './chat.websocket.gateway';
import { RoomDto } from './chat.dto';

interface Status {
  status: string;
  message: string;
}

export interface MessageDto {
  username: string;
  content: string;
  createdAt: Date;
}

@Controller('/api/v1/rooms')
export class RoomsController {
  @Post()
  @HttpCode(201)
  createRoom(@Body() roomDto: RoomDto): void {
    console.log(`Creating chat room...,${roomDto}`);
    try {
      return ChatWebsocketGateway.createRoom(roomDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('/:roomId/messages')
  getRoomMessages(
    @Param('roomId') roomId: string,
    @Query('fromIndex', new ParseIntPipe(), new DefaultValuePipe(0))
    fromIndex: number,
    @Query('toIndex', new ParseIntPipe(), new DefaultValuePipe(0))
    toIndex: number,
  ): MessageDto[] {
    if (fromIndex <= 0 || toIndex <= 0) {
      this.throwBadRequestException(
        'req-params.validation',
        "Invalid parameters, 'fromIndex' and 'toIndex' must be positive!",
      );
    }
    if (fromIndex > toIndex) {
      this.throwBadRequestException(
        'req-params.validation',
        "Invalid parameters,'toIndex' must not be less than 'fromIndex'",
      );
    }
    try {
      return chatService.getMessages(roomId, fromIndex, toIndex);
    } catch (error) {
      throw new ForbiddenException({
        code: 'access-forbidden',
        message: 'The access is forbidden!',
      });
    }
  }

  @Delete('/:roomId')
  @HttpCode(204)
  closeRoom(@Param('roomId') roomId: string): void {
    console.log(`Deleting room with roomID: ${roomId}`);
    try {
      ChatWebsocketGateway.close(roomId);
    } catch (error) {
      throw error;
    }
  }

  private throwBadRequestException(code: string, message: string) {
    throw new BadRequestException({ code, message });
  }
}
