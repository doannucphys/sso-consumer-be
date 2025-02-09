import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // aa: process?.env?.AAA || false,
}));
