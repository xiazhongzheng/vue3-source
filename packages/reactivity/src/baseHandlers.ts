import { extend, isObject } from '@vue/shared'
import { reactive, readonly } from './reactive';
// 是不是只读， 是不是深度

function createGetter(isReadonly = false, shallow = false) {
    return function get (target, key, receiver) {
        const res = Reflect.get(target, key, receiver)

        if (!isReadonly) {
            // 收集依赖
        }

        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            //  vue2是一上来就递归监测， vue3是使用了才监测
            return isReadonly ? readonly(res) : reactive(res);
        }

        return res;
    }
}
function createSetter(shallow = false) {
    return function set(target, key, value, reveiver) {
        const result = Reflect.set(target, key, value, reveiver);


        return result;
    }
}
const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);
const set = createSetter();
const shallowSet = createSetter(true);
export const mutableHandlers = {
    get,
    set
};
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
};

let readonlySet = {
    set: (target, key) => {
        console.warn(`set on key ${key} failed`)
    }
}
export const readonlyHandlers = extend({
    get: readonlyGet
}, readonlySet)
export const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet
}, readonlySet);