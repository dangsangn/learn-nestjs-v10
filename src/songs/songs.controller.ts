import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('songs')
export class SongsController {
  @Post()
  create(data: any) {
    console.log(data);
  }

  @Get()
  getAll() {
    console.log('Get all');
  }

  @Get(':id')
  findOne(id: number) {
    console.log(id);
  }

  @Put(':id')
  update(id: number) {
    console.log(id);
  }

  @Delete(':id')
  delete(id: string) {
    console.log(id);
  }
}
