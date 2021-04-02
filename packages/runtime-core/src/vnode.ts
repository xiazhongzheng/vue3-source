import { isString, ShapeFlags } from "@vue/shared/src";

// h('div', {style: }, 'childern')
export function createVnode(type, props, children = null) {
    // type 可能是元素字符串，也可能是组件对象
    // 虚拟节点具有跨平台的能力
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : ShapeFlags.COMPONENT;
    const vnode = {
        __v_isVnode: true,
        type,
        props,
        children,
        key: props && props.key,
        el: null, // 稍后放的真实节点
        shapeFlag
    }
    return vnode;
}