import {
  Body,
  Controller,
  Get,
  Param,
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
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { Public } from '../auth/decorators/public.decorator';

interface AuthenticatedUser {
  userId: string;
  tenantId?: string;
}

@ApiTags('stock-movements')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Registra uma nova movimentação de estoque' })
  @ApiResponse({
    status: 201,
    description: 'Movimentação registrada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Estoque insuficiente ou dados inválidos.',
  })
  create(
    @Body() createStockMovementDto: CreateStockMovementDto,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    if (user?.tenantId && !createStockMovementDto.tenantId) {
      createStockMovementDto.tenantId = user.tenantId;
    }
    return this.stockMovementsService.create(
      createStockMovementDto,
      user?.userId,
      user?.tenantId,
    );
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lista todas as movimentações de estoque' })
  @ApiQuery({ name: 'tenantId', required: false })
  findAll(
    @CurrentUser() user?: AuthenticatedUser,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const effectiveTenantId =
      user?.tenantId || (user ? queryTenantId : undefined);
    return this.stockMovementsService.findAll(effectiveTenantId);
  }

  @Get('product/:productId')
  @Public()
  @ApiOperation({ summary: 'Lista as movimentações de um determinado produto' })
  @ApiResponse({
    status: 200,
    description: 'Movimentações do produto retornadas.',
  })
  @ApiResponse({ status: 400, description: 'ID de produto inválido.' })
  findByProduct(
    @Param('productId', ParseObjectIdPipe) productId: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.stockMovementsService.findByProduct(productId, user?.tenantId);
  }
}
