import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MySQLService } from '../database/mysql.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, MySQLService],
})
export class TasksModule {}