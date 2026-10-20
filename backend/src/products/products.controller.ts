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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.OWNER, Role.MANAGER, Role.ADMIN)
  @ApiOperation({
    summary: 'Cadastra um novo produto (OWNER, MANAGER ou ADMIN)',
  })
  @ApiResponse({ status: 201, description: 'Produto cadastrado com sucesso.' })
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    if (user?.tenantId && !createProductDto.tenantId) {
      createProductDto.tenantId = user.tenantId;
    }
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lista todos os produtos ativos do bar' })
  @ApiQuery({ name: 'tenantId', required: false })
  findAll(
    @CurrentUser() user?: AuthenticatedUser,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const effectiveTenantId =
      user?.tenantId || (user ? queryTenantId : undefined);
    return this.productsService.findAll(effectiveTenantId);
  }

  @Get('replenishment')
  @Public()
  @ApiOperation({
    summary:
      'Lista produtos formatados com status de reposição (CRITICO, ALERTA, NORMAL) para MeuBotequim',
  })
  @ApiQuery({ name: 'tenantId', required: false })
  getReplenishment(
    @CurrentUser() user?: AuthenticatedUser,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const effectiveTenantId =
      user?.tenantId || (user ? queryTenantId : undefined);
    return this.productsService.getReplenishmentList(effectiveTenantId);
  }

  @Get('low-stock')
  @Public()
  @ApiOperation({
    summary: 'Lista produtos que atingiram ou estão abaixo do estoque mínimo',
  })
  @ApiQuery({ name: 'tenantId', required: false })
  findLowStock(
    @CurrentUser() user?: AuthenticatedUser,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const effectiveTenantId =
      user?.tenantId || (user ? queryTenantId : undefined);
    return this.productsService.findLowStock(effectiveTenantId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Busca os detalhes de um produto pelo ID' })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.productsService.findOne(id, user?.tenantId);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.MANAGER, Role.ADMIN)
  @ApiOperation({
    summary: 'Atualiza os dados de um produto (OWNER, MANAGER ou ADMIN)',
  })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const isAdmin = user?.role === Role.ADMIN;
    return this.productsService.update(
      id,
      updateProductDto,
      user?.tenantId,
      isAdmin,
    );
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativa um produto do catálogo (OWNER ou ADMIN)' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const isAdmin = user?.role === Role.ADMIN;
    return this.productsService.remove(id, user?.tenantId, isAdmin);
  }
}
