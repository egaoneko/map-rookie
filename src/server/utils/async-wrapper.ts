import { Request, Response, NextFunction, RequestHandler } from 'express-serve-static-core';

function asyncWrapper(fn: Function): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

export default asyncWrapper;
