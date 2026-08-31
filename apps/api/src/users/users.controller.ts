import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }
  @Post()
  async createUser(@Body() data: any) {
    return await this.usersService.createUser(data);
  }
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
  @Post('/restore/:id')
  async restoreUser(@Param('id') id: string) {
    return await this.usersService.restoreUser(id);
  }
  @Post('/update/:id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return await this.usersService.updateUser(id, data);
  }
}
