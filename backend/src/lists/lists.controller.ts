import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  findAll() {
    return this.listsService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.listsService.create(name);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.listsService.delete(Number(id));
  }
}