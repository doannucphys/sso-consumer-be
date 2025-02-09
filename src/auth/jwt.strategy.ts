import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import express from 'express';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    // private readonly cacheService: CacheService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt').secret,

      // pass request to validate function
      passReqToCallback: true,

      algorithms: ['RS256'],
    });
  }

  async validate(req: express.Request, payload: any) {
    // token get from Fe
    const accessToken = req.headers['authorization'];

    // check if auth cached data exis
    let logindata =  await this.cacheService.get(
      `${this.configService.get('redis').prefix}_loginkey_${payload.id}`,
    );

    // to avoid use of old token
    if (logindata && accessToken !== logindata) {
      throw new UnauthorizedException();
    }

    // if not exist, check on sso server
    if (!logindata) {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
          Accept: 'application/json, multipart/form-data',
        },
      };

      const result = await lastValueFrom(
        this.httpService.get('/user/profile', requestConfig).pipe(
          map((response) => {
            return response?.data;
          }),
          catchError((e: AxiosError) => {
            throw e;
          }),
        ),
      );
      
      if (result?.name || result?.username) {
        await this.cacheService.set(
          `${this.configService.get('redis').prefix}_loginkey_${payload.id}`,
          accessToken,
        );
      } else {
        throw new UnauthorizedException();
      }
    }

    return {
      id: payload.id,
      username: payload.username,
      name: payload.name,
    };
  }
}
