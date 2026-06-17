import { Module } from '@nestjs/common';
import { EnrollController } from './enroll/enroll.controller';
import { EnrollService } from './enroll/enroll.service';

@Module({
  controllers: [EnrollController],
  providers: [EnrollService]
})
export class AdminModule {}
