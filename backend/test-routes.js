const express = require('express');
const authRoutes = require('./routes/authRoutes');
const routes = require('./routes/index');

const app = express();
app.use('/api/v1', routes);

const listEndpoints = (app) => {
    const endpoints = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            endpoints.push(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    endpoints.push(`${Object.keys(handler.route.methods)} ${middleware.regexp} ${handler.route.path}`);
                }
            });
        }
    });
    return endpoints;
};

console.log('Registered Routes:');
// Simplified check
app._router.stack.filter(r => r.route || r.name === 'router').forEach(r => {
    if (r.route) console.log(r.route.path);
    if (r.name === 'router') {
        r.handle.stack.filter(s => s.route || s.name === 'router').forEach(s => {
            if (s.route) console.log('  ' + s.route.path);
            if (s.name === 'router') {
                s.handle.stack.filter(t => t.route).forEach(t => {
                    console.log('    ' + t.route.path);
                });
            }
        });
    }
});
