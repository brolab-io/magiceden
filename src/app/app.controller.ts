import { Get, Controller, Render, Param, Query } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }

  @Get('/proxy')
  getProxy(@Query('url') url: string) {
    return fetch(url).then((res) => res.json());
  }
}
