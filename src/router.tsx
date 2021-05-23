import UniversalRouter from 'universal-router'
import React, { Component } from 'react'

// @ts-ignore
import generateUrls from 'universal-router/generateUrls';

import Hello from "./components/Hello";


function errorHandler(error) {
    return {
        title: error.status === 404 ? 'Page not found' : 'System Error',
        status: error.status || 500,
        error,
    };
}

function resolveRoute(context, params) {
    if (typeof context.route.action === 'function') {
        return context.route.action(context, params)
    }
    return undefined
}

const options = {
    context: { user: null },
    resolveRoute: resolveRoute,
    errorHandler: errorHandler

}

// @ts-ignore
const router = new UniversalRouter([ // all your routes here
    {
        path: '/', name: 'index', action: (ctx, params) => {
            return (<Hello><h1>Home</h1></Hello>);
        }
    },
    { path: '/users', name: 'users', action: () => <Hello><h1>Users</h1></Hello> },
    { path: '/user/:id', name: 'user', action: (ctx) => <Hello><h1>User#{ctx.params.id}</h1></Hello> }
], options);



// @ts-ignore
export const makeUrl = generateUrls(router);


export default router;
