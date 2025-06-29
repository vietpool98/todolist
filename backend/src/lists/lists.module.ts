import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { MySQLService } from '../database/mysql.service';

@Module({
  controllers: [ListsController],
  providers: [ListsService, MySQLService],
  exports: [ListsService],
})
export class ListsModule {}