import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { FleetsService } from './fleets.service';
import { Fleets } from './entities/Fleets.entity';

@Controller('fleets')
export class FleetsController {
  constructor(private readonly service: FleetsService) {}

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
