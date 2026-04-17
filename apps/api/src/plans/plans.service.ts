import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PDFService } from '../pdf/pdf.service';

@Injectable()
export class PlansService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PDFService
  ) {}

  async create(userId: string, dto: CreatePlanDto) {
    const plan = await this.prisma.plan.create({
       { userId, ...dto, content: JSON.parse(dto.content as string) },
      include: { student: true, template: true, template: { include: { images: true } } }
    });
    
    // Generar PDF automáticamente al guardar
    const pdfBuffer = await this.pdfService.generate(plan);
    const pdfUrl = await this.pdfService.uploadToStorage(pdfBuffer, plan.id);
    
    return this.prisma.plan.update({
      where: { id: plan.id },
       { pdfUrl }
    });
  }

  async update(id: string, userId: string, dto: Partial<CreatePlanDto>) {
    return this.prisma.plan.update({
      where: { id, userId },
       { content: dto.content ? JSON.parse(dto.content as string) : undefined, ...dto }
    });
  }

  async findAll(userId: string, filters: any) {
    return this.prisma.plan.findMany({
      where: { userId, ...filters },
      include: { student: { select: { fullName: true, diagnosis: true } }, template: true },
      orderBy: { generatedAt: 'desc' }
    });
  }
}