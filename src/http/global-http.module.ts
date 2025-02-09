import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        baseURL: await configService.get('HTTP_BASE_URL'),
        timeout: await configService.get('HTTP_TIMEOUT'),
        maxRedirects: await configService.get('HTTP_MAX_REDIRECTS'),
      }),
    }),
  ],
  exports: [HttpModule],
})
export class GlobalHttpModule {}
