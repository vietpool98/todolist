import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('list/:listId')
  findByList(@Param('listId') listId: string) {
    return this.tasksService.findByListId(Number(listId));
  }

  @Post()
  create(@Body() task: any) {
    return this.tasksService.create(task);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body('completed') completed: boolean) {
    return this.tasksService.updateStatus(Number(id), completed);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(Number(id));
  }
}