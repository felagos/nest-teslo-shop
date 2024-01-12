import { Module } from '@nestjs/common';
import { MessageWsService } from './message-ws.service';
import { MessageWsGateway } from './message-ws.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [MessageWsGateway, MessageWsService],
  imports: [JwtModule],
})
export class MessageWsModule {}
