import fs from 'fs';
import * as path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryHistory } from 'history';
import StyleContext from 'isomorphic-style-loader/StyleContext'

import router from "./router";

import Html from "./components/Html";

import { BUILD_TS, APP_VERSION, BUILD_DT } from './build_info';
import { setup_meta_headers } from './server/middlewares';
import { get_assets, get_config, asyncHandler } from './server/utils';
import argv from './server/arguments';


const config = get_config(argv.config);

const client_assets = get_assets(config['stats']['client'], 'client');
const assets = [...client_assets];

const app = express();

app.disable('x-powered-by');


async function handler(req: Request, res: Response, _next: NextFunction) {

    console.log(`Handle request ${req.url}`)
    const { path: pathname, originalUrl: url } = req;

    const history = createMemoryHistory({ initialEntries: [pathname] });

    const component = await router.resolve({ pathname: req.url });

    // const css = new Set(); // CSS for all rendered React components
    // const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));

    // console.log(component);

    // const markup = ReactDOMServer.renderToStaticMarkup(<Html assets={assets} config={config}>{component}</Html>)
    const html = (<Html assets={assets} config={config}>{component}</Html>);

    // const markup = ReactDOMServer.renderToString(html);

    // console.log(markup);

    res.write('<!DOCTYPE html>');

    const stream = ReactDOMServer.renderToNodeStream(html);
    stream.pipe(res, { end: false });
    stream.on('end', () => {
        res.end();
    });
    // res.write(markup);
    // res.end();
}


app.use(setup_meta_headers);

// @ts-ignore
if (__DEVELOPMENT__ || config['static']['serve'] == true) {
    const static_path = path.resolve(__dirname, config['static']['dir'])
    console.warn(`Serve static in development mode: ${config['static']['prefix']} => ${static_path}`)
    app.use(config['static']['prefix'], express.static(static_path))
}

app.use(asyncHandler(handler));


const { host, port } = config['listen'];

app.listen({
    host: host,
    port: port
}, () => {
    console.log(`Server listening at ${host}:${port}`)
})
