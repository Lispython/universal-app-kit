import fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';


export function parse_stats(filename: string) {
    const stats = fs.readFileSync(path.resolve(__dirname, filename), 'utf8')
    return JSON.parse(stats);
}

export function get_assets(filename: string, name: string) {
    const assets = parse_stats(filename);
    return assets['assetsByChunkName'][name];
}


export function get_config(filename: string) {
    const content = fs.readFileSync(path.resolve(__dirname, filename), 'utf8');
    return JSON.parse(content);

}


export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)
