import { extend, hasChange, hasOwn, isArray, isIntegerKey, isObject } from '@vue/shared'
import { track, trigger } from './effect';
import { TrackOpTypes, TriggerOrTypes } from './operators';
import { reactive, readonly } from './reactive';
// 是不是只读， 是不是深度

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver)

        if (!isReadonly) {
            // 收集依赖
            track(target, TrackOpTypes.GET, key);
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
        console.log('set')
        const oldValue = target[key];
        // 数组push方法等，也会修改length和索引
        let hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
        
        const result = Reflect.set(target, key, value, reveiver);
        // vue2无法监控更改索引，vue3可以

        if(!hasKey){
            // 新增
            trigger(target, TriggerOrTypes.ADD, key, value);
        } else if (hasChange(oldValue, value)) {
            // 修改
            trigger(target, TriggerOrTypes.SET, key, value, oldValue);
        }


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