import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';

@Module({
  imports: [
    UserModule, EmailModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal:true
    }),
    ConfigModule,
    TypeOrmModule.forRoot(
      {
        type : 'mariadb',
        host : process.env.DATABASE_HOST,
        port : 3306,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: 'test',
        entities : [__dirname + '/**/*.entity{.ts,.js}'],
        // entities:[UserEntity],
        // synchronize : Boolean(process.env.DATABASE_SYNCHRONIZE), //서비스 구동시 소스코드 기반으로 데이터베이스 스키마를 동기화 할 지
      }
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
