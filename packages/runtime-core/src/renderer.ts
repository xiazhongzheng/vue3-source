import { createAppAPI } from "./apiCreateApp"

export function createRenderer(rendererOptions) {
    // 创建渲染器
    // rendererOptions告诉core怎么渲染
    const render = function (vnode, container) {

    }
    
    return {
        createApp: createAppAPI(render)
    }
}