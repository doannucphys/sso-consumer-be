import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  return {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    ttl: process.env.REDIS_TTL,
    prefix: process.env.REDIS_PREFIX,
  };
});
