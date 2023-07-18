import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhoneModule } from './phones/phones.module';
import { ApolloModule } from './apollo/apollo.module';

@Module({
  imports: [PhoneModule, ApolloModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
