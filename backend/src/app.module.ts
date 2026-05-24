import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './config/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkersModule } from './modules/workers/workers.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { BidsModule } from './modules/bids/bids.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    WorkersModule,
    ProjectsModule,
    BidsModule,
    ChatModule,
    ReviewsModule,
    PaymentsModule,
    NotificationsModule,
    AdminModule,
    CategoriesModule,
    DisputesModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
