import { Controller, Post, Get, Delete, Param, UseInterceptors, UploadedFile, Body, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

const storage = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads', 'images'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @Roles('admin', 'psychopedagogue', 'teacher')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async upload(@UploadedFile() file, @Body() body: CreateImageDto) {
    return this.imagesService.create({
      ...body,
      url: `/uploads/images/${file.filename}`,
      thumbnail: `/uploads/images/thumb-${file.filename}`, // Generado por Sharp
    });
  }

  @Get()
  async findAll(@Query('category') category?: string, @Query('search') search?: string) {
    return this.imagesService.findAll(category, search);
  }

  @Delete(':id')
  @Roles('admin', 'psychopedagogue')
  async remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
}