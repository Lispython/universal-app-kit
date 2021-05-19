
import UniversalRouter from 'universal-router'
import React, { Component } from 'react'


import Hello from "./components/Hello";


export default new UniversalRouter([ // all your routes here
    { path: '/', name: 'index', action: () => <Hello><h1>Home</h1></Hello> },
    { path: '/users', name: 'users', action: () => <Hello><h1>Users</h1></Hello> },
    { path: '/user/:id', name: 'user', action: (ctx) => <Hello><h1>User#{ctx.params.id}</h1></Hello> }
])
