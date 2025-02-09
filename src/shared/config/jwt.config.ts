import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_PUBLIC_KEY,
    exp: process.env.JWT_EXP,
  };
});
