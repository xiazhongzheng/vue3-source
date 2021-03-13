export const patchEvents = (el, key, value) => {
    // 在el上做缓存  vue event invoker
    const invokers = el._vei || (el._vei = {});
    const exists = invokers[key];
    if (value && exists) {
        exists.value = value;
    } else {
        const eventName = key.slice(2).toLowerCase();
        if (value) {
            const invoker = invokers[key] = createInvoker(value);
            // 绑定的事件是同一个事件不变，里面包一层，调用里面可以变化的value
            el.addEventListener(eventName, invoker);
        } else {
            // 不用考虑exists不存在吗？
            el.removeEventListener(eventName, exists);
            invokers[key] = undefined;
        }
    }

}

function createInvoker(value) {
    const invoker = (e) => {
        invoker.value(e);
    }
    invoker.value = value;
    return invoker;
}

// value = fn
// value = fn1
// div @click="fn"  () => value()
// div @click="fn1" 更改
// div 移除
