import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { BillingAccountsService } from './billing-accounts.service';
import { BillingAccounts } from './entities/BillingAccounts.entity';

@Controller('billing-accounts')
export class BillingAccountsController {
  constructor(private readonly service: BillingAccountsService) {}

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
