import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface AuthenticatedUser {
  userId: string;
  tenantId?: string;
}

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @Public()
  @ApiOperation({
    summary:
      'Obtém métricas agregadas do bar (ou dados de demonstração para visitantes)',
  })
  @ApiQuery({ name: 'tenantId', required: false })
  getMetrics(
    @CurrentUser() user?: AuthenticatedUser,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const effectiveTenantId =
      user?.tenantId || (user ? queryTenantId : undefined);
    return this.dashboardService.getMetrics(effectiveTenantId);
  }
}
