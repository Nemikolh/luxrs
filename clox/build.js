#!/usr/bin/env node

const { readdirSync, statSync } = require('fs');
const { join, dirname, basename } = require('path');
const { spawnSync } = require('child_process');

const DEFAULT_STACK_SIZE = 256;
const USAGE = `
Build tool for clox. Compile all the files into
an executable. Default output executable name
is 'clox'.

Usage:
    ./build.js [options] [output]

Arguments:
    %--release%        Perform a prod build.
    %--help%           Show this help message.
    %--verbose%        Show all commands executed.
    %--stack-size%     Define the stack size (default: ${DEFAULT_STACK_SIZE}).
`;

const buildOptions = {
    flags: ['-Wall'],
    output: 'cloxc',
    tmpDir: 'build',
    verbose: false,
};

processArgs();
build();

// Helpers
function build() {
    const cfiles = [];
    const ofiles = [];
    walk('.', cfiles);
    cfiles.filter(file => file.endsWith('.c')).forEach(file => {
        const filename = basename(file);
        const dirDest = join(buildOptions.tmpDir, dirname(file));
        const dest = join(dirDest, filename.slice(0, -1) + 'o');
        cmd('mkdir', ['-p', dirDest]);
        cmd('gcc', buildOptions.flags.concat(['-c', filename, '-o', dest]));
        ofiles.push(dest);
    });
    const res = cmd('gcc', buildOptions.flags.concat(['-o', buildOptions.output]).concat(ofiles));
    process.exit(res.status);
}

function cmd(cmdname, args) {
    if (buildOptions.verbose) {
        console.log(`${cmdname} ${args.join(' ')}`);
    }
    return spawnSync(cmdname, args, { stdio: 'inherit' });
}

function processArgs() {
    const availOpts = USAGE.split('%').filter(o => o.startsWith('--'));
    if (process.argv.includes('--help')) {
        console.log(USAGE.replace(/\%/g, ''));
        process.exit(0);
    }
    if (!process.argv.slice(2).every(o => !o.startsWith('--') || availOpts.includes(o))) {
        console.log(`Unknown arguments. See help:`);
        console.log(USAGE.replace(/\%/g, ''));
        process.exit(1);
    }
    if (process.argv.includes('--release')) {
        buildOptions.flags.push('-O3');
    } else {
        buildOptions.flags.push('-g', '-DDEBUG_TRACE_EXECUTION');
    }
    if (process.argv.includes('--verbose')) {
        buildOptions.verbose = true;
    }
    let stackSize = DEFAULT_STACK_SIZE;
    if (process.argv.includes('--stack-size')) {
        const stackParam = process.argv[process.argv.indexOf('--stack-size') + 1];
        try {
            stackSize = parseInt(stackParam, 10);
        } catch (err) {
            console.error(`Invalid stack size argument ${stackSize}. Expected integer.`);
        }
    }
    buildOptions.flags.push(`-DSTACK_MAX=${stackSize}`);
}

function walk(dir, res) {
    const files = readdirSync(dir);
    files.forEach(file => {
        const filepath = join(dir, file);
        const stat = statSync(filepath);
        if (stat.isDirectory()) {
            walk(filepath, res);
        } else if (stat.isFile()) {
            res.push(filepath);
        }
    });
}