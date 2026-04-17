import { Module } from '@nestjs/common';
import { PlansController } from './plans/plans.controller';
import { PlansService } from './plans/plans.service';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [ImagesModule],
  controllers: [PlansController],
  providers: [PlansService],
})
export class AppModule {}
