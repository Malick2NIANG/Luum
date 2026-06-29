import { All, Controller, Req, Res } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import type { Request, Response } from 'express';
import { auth } from './auth.config';

@Controller('api/auth')
export class AuthController {
  private readonly handler = toNodeHandler(auth);

  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.handler(req, res);
  }
}
