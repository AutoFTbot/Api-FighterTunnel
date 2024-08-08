// app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiTrialController } from './api/api.controller.trial';
import { ApiVmessController } from './api/api.controller.vmess';
import { ApiSSHController } from './api/api.controller.ssh';
import { ApiTrojanController } from './api/api.controller.trojan';
import { ApiVlessController } from './api/api.controller.vless';
import { ApiDelController } from './api/api.controller.del';
import { ApiCekController } from './api/api.controller.cek';
import { ApiRenewController } from './api/api.controller.renew';
import { AuthGuard } from './api/auth.guard';
import { ApiKeyGuard } from './api/api-key.guard';
import { IpWhitelistGuard } from './api/ip-whitelist.guard';

@Module({
  imports: [],
  controllers: [ApiTrialController, ApiCekController, ApiDelController, ApiRenewController, ApiVmessController, ApiSSHController, ApiTrojanController, ApiVlessController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: IpWhitelistGuard, // Terapkan guard IP terlebih dahulu
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard, // Terapkan guard API key setelah IP guard
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Terapkan guard auth lainnya jika diperlukan
    },
  ],
})
export class AppModule {}
