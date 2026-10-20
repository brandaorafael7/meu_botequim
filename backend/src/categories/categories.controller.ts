import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface AuthenticatedUser {
  userId: string;
  role: Role;
  tenantId?: string;
}

@ApiTags('categories')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.OWNER, Role.MANAGER, Role.ADMIN)
  @ApiOperation({
    summary: 'Cria uma nova categoria (OWNER, MANAGER ou ADMIN)',
  })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Nome de categoria duplicado' })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.categoriesService.create(createCategoryDto, user?.tenantId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lista todas as categorias ativas do bar' })
  @ApiQuery({ name: 'tenantId', required: false })
  findAll(
    @CurrentUser() user?: AuthenticatedUser,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const effectiveTenantId =
      user?.tenantId || (user ? queryTenantId : undefined);
    return this.categoriesService.findAll(effectiveTenantId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Busca uma categoria pelo ID' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.categoriesService.findOne(id, user?.tenantId);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.MANAGER, Role.ADMIN)
  @ApiOperation({
    summary: 'Atualiza uma categoria existente (OWNER, MANAGER ou ADMIN)',
  })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const isAdmin = user?.role === Role.ADMIN;
    return this.categoriesService.update(
      id,
      updateCategoryDto,
      user?.tenantId,
      isAdmin,
    );
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativa uma categoria (OWNER ou ADMIN)' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const isAdmin = user?.role === Role.ADMIN;
    return this.categoriesService.remove(id, user?.tenantId, isAdmin);
  }
}
