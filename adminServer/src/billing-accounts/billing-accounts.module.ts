import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingAccounts } from './entities/BillingAccounts.entity';
import { BillingAccountsService } from './billing-accounts.service';
import { BillingAccountsController } from './billing-accounts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BillingAccounts])],
  controllers: [BillingAccountsController],
  providers: [BillingAccountsService],
  exports: [BillingAccountsService],
})
export class BillingAccountsModule {}
