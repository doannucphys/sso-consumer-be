import { Controller, Get, UseGuards, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HttpExceptionFilter } from '@src/shared/filter/http-exception.filter';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // @UseFilters(new HttpExceptionFilter())
  @Get('private')
  findOne() {
    return {
      id: 'order1',
      product: 'My Product 1',
    };
  }
}
