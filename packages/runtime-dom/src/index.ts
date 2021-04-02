//  用户调用runtime-dom -> runtime-core


import { createRenderer } from "@vue/runtime-core/src";
import { extend } from "@vue/shared/src";
import { nodeOps } from "./nodeOps";
import { PatchProp } from "./patchProp";

// 把PatchProp方法，和nodeOps对象里面的方法，统一放到rendererOptions
const rendererOptions = extend({ PatchProp }, nodeOps);


// runtime-dom 提供了操作dom的方法，传给runtime-core来渲染，核心方法由core提供。
export function createApp(rootComponent, rootProps = null) {
    const app = createRenderer(rendererOptions).createApp(rootComponent, rootProps);
    let { mount } = app;
    app.mount = function (container) {
        container = nodeOps.querySelector(container);
        container.innerHTML = '';
        mount(container); // 函数劫持
    }
    return app;
}