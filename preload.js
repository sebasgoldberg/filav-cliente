#!/usr/bin/env node
/* eslint-env node */
var preload = require('openui5-preload');

preload({
    resources: { cwd: 'webapp', prefix: 'iamsoft/filav/cliente' },
    dest: 'webapp',
    compress: true,
    verbose: true,
    components: true,
});

