import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @Public()
  @ApiOperation({
    summary: 'Obtém métricas agregadas para o painel de controle',
  })
  @ApiQuery({ name: 'tenantId', required: false })
  getMetrics(@Query('tenantId') tenantId?: string) {
    return this.dashboardService.getMetrics(tenantId);
  }
}
