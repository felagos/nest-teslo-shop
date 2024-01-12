import { Module } from '@nestjs/common';
import { MessageWsService } from './message-ws.service';
import { MessageWsGateway } from './message-ws.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [MessageWsGateway, MessageWsService],
  imports: [JwtModule, ConfigModule],
})
export class MessageWsModule {}
