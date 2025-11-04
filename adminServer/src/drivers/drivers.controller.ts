import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Drivers } from './entities/Drivers.entity';

@Controller('drivers')
export class DriversController {
  constructor(private readonly service: DriversService) {}

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
