import type { SessionUser } from '../auth/auth.config';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export {};
