import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: CategoryQueryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get('tree')
  getCategoryTree(@Query('rootId') rootId?: string) {
    return this.categoriesService.getCategoryTree(rootId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Get(':id/path')
  getCategoryPath(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.getCategoryPath(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch('sort-order')
  @UseGuards(RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  updateSortOrder(@Body() updates: { id: string; sortOrder: number }[]) {
    return this.categoriesService.updateSortOrder(updates);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}