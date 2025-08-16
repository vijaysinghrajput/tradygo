import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CategoryService } from './category.service';
import { CategoryAdminController } from './category_admin.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryAdminController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
