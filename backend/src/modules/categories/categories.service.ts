import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang?: string) {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return {
      data: categories.map((c) => ({
        ...c,
        name: lang === 'ru' ? c.nameRu : lang === 'en' ? c.nameEn : c.nameUz,
      })),
    };
  }

  async findOne(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    return { data: cat };
  }
}
