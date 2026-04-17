import { Controller, Post, Body, UseGuards, Req, HttpCode } from '@nestjs/common'
import { PlansService } from './plans.service'
import { CreatePlanDto } from './dto/create-plan.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@Controller('plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @Roles('psychopedagogue', 'teacher', 'admin')
  @HttpCode(201)
  async create(@Req() req, @Body() dto: CreatePlanDto) {
    return this.plansService.create(req.user.id, dto)
  }

  @Post('/generate-pdf')
  @Roles('psychopedagogue', 'teacher', 'admin')
  async generatePDF(@Body() dto: CreatePlanDto) {
    return this.plansService.generatePDF(dto)
  }
}