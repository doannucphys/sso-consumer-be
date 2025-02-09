import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}
  async logout(user: any) {
    await this.cacheService.del(
      `${this.configService.get('redis')?.prefix}_loginkey_${user?.id}`,
    );
    return {
      message: 'logout successfully',
    };
  }
}
