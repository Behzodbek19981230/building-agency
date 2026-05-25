import { Injectable, NotFoundException } from '@nestjs/common';
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

  // ── Admin methods ──────────────────────────────────────────────────────────

  async findAllAdmin() {
    const categories = await this.prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { projects: true } } },
    });
    return { data: categories };
  }

  async create(dto: {
    slug: string;
    nameUz: string;
    nameRu: string;
    nameEn: string;
    nameCyr?: string;
    icon?: string;
    description?: string;
    order?: number;
    isActive?: boolean;
  }) {
    const category = await this.prisma.category.create({ data: dto as any });
    return { data: category };
  }

  async update(
    id: string,
    dto: {
      nameUz?: string;
      nameRu?: string;
      nameEn?: string;
      nameCyr?: string;
      icon?: string;
      description?: string;
      order?: number;
      isActive?: boolean;
    },
  ) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    const updated = await this.prisma.category.update({ where: { id }, data: dto });
    return { data: updated };
  }

  async remove(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    await this.prisma.category.update({ where: { id }, data: { isActive: false } });
    return { data: { success: true } };
  }
}
