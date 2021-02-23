// 打包packages所有包
const fs = require('fs');
const execa = require('execa'); // 开启子进程 用rollup打包

const targets = fs.readdirSync('packages').filter(f => {
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false;
    }
    return true;
});

async function build(target) {
    // 打包时，每个模块都会调用rollup，使用rollup.config.js里的配置
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {stdio: 'inherit'}); // 子进程的信息共享给父进程
}

function runParallel(targets,iteratorFn) {
    const res = [];
    for (const item of targets) {
        const p = iteratorFn(item);
        res.push(p);
    }
    return Promise.all(res);
}
runParallel(targets,build);