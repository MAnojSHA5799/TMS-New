import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fleets } from './entities/Fleets.entity';
import { FleetsService } from './fleets.service';
import { FleetsController } from './fleets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fleets])],
  controllers: [FleetsController],
  providers: [FleetsService],
  exports: [FleetsService],
})
export class FleetsModule {}
