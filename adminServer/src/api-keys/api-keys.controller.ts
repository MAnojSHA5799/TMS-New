import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeys } from './entities/ApiKeys.entity';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly service: ApiKeysService) {}

  @Post()
  create(@Body() body: any) { return this.service.create(body); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
