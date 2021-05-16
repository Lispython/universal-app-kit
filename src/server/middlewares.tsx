import { Request, Response, NextFunction } from 'express';

import { BUILD_TS, APP_VERSION } from '../build_info';


export function setup_meta_headers(_req: Request, res: Response, next: NextFunction) {
    res.setHeader('X-Version', APP_VERSION);
    res.setHeader('X-Build-Ts', `${BUILD_TS}`);
    next();
}
