import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from './entities/Roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

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
