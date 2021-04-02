import { createVnode } from "./vnode";

export function createAppAPI(render) {
    return function createApp(rootComponent, rootProps) {
        // 告诉组件和属性
        const app = {
            _props: rootProps,
            _component: rootComponent,
            _container: null,
            mount(container) {
                // 告诉挂载的地方
                // let vnode = {};
                // render(vnode, container);
                // 1. 创建vnode
                const vnode = createVnode(rootComponent, rootProps);
                // 2. render渲染
                render(vnode, container);
            }
        }
        return app;
    }
}