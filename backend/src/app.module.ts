import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlotsModule } from './slots/slots.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'tutoring',
      password: process.env.DB_PASSWORD ?? 'tutoring',
      database: process.env.DB_NAME ?? 'tutoring',
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
      retryAttempts: 10,
      retryDelay: 3000,
      extra: {
        connectionTimeoutMillis: 5000,
      },
    }),
    SlotsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
