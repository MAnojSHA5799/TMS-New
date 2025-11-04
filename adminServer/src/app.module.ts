import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';

// Import your feature modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
//import { RolePermissionsModule } from './role-permissions/role-permissions.module';
//import { UserRolesModule } from './user-roles/user-roles.module';
import { TenantsModule } from './tenants/tenants.module';
import { TenantSettingsModule } from './tenant-settings/tenant-settings.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { SystemAuditModule } from './system-audit/system-audit.module';
import { DriversModule } from './drivers/drivers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { FleetsModule } from './fleets/fleets.module';
import { BillingAccountsModule } from './billing-accounts/billing-accounts.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { RoutesModule } from './routes/routes.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

// Optional: Add a Health Check Controller
import { Controller, Get } from '@nestjs/common';

@Controller()
class HealthController {
  @Get('/')
  getHealth() {
    return {
      status: 'OK',
      message: 'Fleet Management Admin Backend is running ✅',
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig), // ✅ loads DB config from ormconfig.ts
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    //RolePermissionsModule,
    //UserRolesModule,
    TenantsModule,
    TenantSettingsModule,
    SystemSettingsModule,
    SystemAuditModule,
    DriversModule,
    VehiclesModule,
    FleetsModule,
    BillingAccountsModule,
    ApiKeysModule,
    RoutesModule,
    AuditLogsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
