import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../users/schemas/user.schema';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';

interface AuthenticatedUser {
  userId: string;
  tenantId?: string;
  role: Role;
  email: string;
}

@ApiTags('Tenants (Estabelecimentos)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('current')
  @ApiOperation({
    summary: 'Obter dados do estabelecimento atual do usuário logado',
  })
  async getCurrent(@CurrentUser() user: AuthenticatedUser) {
    if (!user || !user.tenantId) {
      // Fallback para o tenant padrão caso seja conta legada
      return this.tenantsService.getOrCreateDefault();
    }
    return this.tenantsService.findById(user.tenantId);
  }

  @Patch('current')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Atualizar dados do estabelecimento atual (apenas Proprietário)',
  })
  async updateCurrent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateTenantDto,
  ) {
    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Tenant não identificado.');
    }
    return this.tenantsService.update(user.tenantId, dto);
  }
}
