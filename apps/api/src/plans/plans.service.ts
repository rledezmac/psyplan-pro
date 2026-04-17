import { Injectable } from '@nestjs/common';

@Injectable()
export class PlansService {
  findAll() {
    return { message: 'Plans endpoint working!', data: [] };
  }

  findOne(id: string) {
    return { message: 'Plan found', id };
  }

  create(createPlanDto: any) {
    return { message: 'Plan created', data: createPlanDto };
  }
}
