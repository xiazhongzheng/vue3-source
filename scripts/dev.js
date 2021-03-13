// 可以按需打包
const fs = require('fs');
const execa = require('execa'); // 开启子进程 用rollup打包

const target = 'runtime-dom';
build(target)
async function build(target) {
    // 打包时，每个模块都会调用rollup，使用rollup.config.js里的配置
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {stdio: 'inherit'}); // 子进程的信息共享给父进程
}

// -c 
// -w watch 监控
// TARGET 自定义参数