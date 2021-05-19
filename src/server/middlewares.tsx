import { Request, Response, NextFunction } from 'express';

import { BUILD_TS, APP_VERSION, BUILD_DT } from '../build_info';


export function setup_meta_headers(_req: Request, res: Response, next: NextFunction) {
    res.setHeader('X-Version', APP_VERSION);
    res.setHeader('X-Build-Ts', `${BUILD_TS}`);

    // @ts-ignore
    if (__DEVELOPMENT__) {
        res.setHeader('X-Build-DT', `${BUILD_DT}`)
    }
    next();
}
