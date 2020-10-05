import { Request, Response, NextFunction } from 'express';

export default (
  asyncFn: (req: Request, res: Response, next?: NextFunction) => any,
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      await asyncFn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};