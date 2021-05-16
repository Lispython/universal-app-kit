
import UniversalRouter from 'universal-router'
import React from 'react'


export default new UniversalRouter([ // all your routes here
    { path: '/', name: 'index', action: () => <h1>Home</h1> },
    { path: '/users', name: 'users', action: () => <h1>Users</h1> },
    { path: '/user/:id', name: 'user', action: (ctx) => <h1>User #{ctx.params.id}</h1> }
])
