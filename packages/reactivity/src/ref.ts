// reactive用的proxy，只能传对象。ref用的defineProperty，可以传基本类型和对象

import { hasChange, isArray, isObject } from "@vue/shared/src";
import { track, trigger } from "./effect";
import { TrackOpTypes, TriggerOrTypes } from "./operators";
import { reactive } from "./reactive";

export function ref(value) {
    // 将普通类型变成一个响应式对象，用的class的get和set，会babel转成defineProPerty
    return createRef(value);
}

export function shallowRef(value) {
    return createRef(value, true);
}
const convert = (val) => {
    return isObject(val) ? reactive(val) : val;
}
class RefImpl {
    public _value;
    public __v_isRef = true;
    constructor(public rawValue, public shallow) {
        this._value = shallow ? rawValue : convert(rawValue);
    }
    // 类的属性访问器
    // 取值.value 代理到_value上
    get value() {
        track(this, TrackOpTypes.GET, 'value');
        return this._value;
    }
    set value(newValue) {
        if (hasChange(newValue, this.rawValue)) {
            this.rawValue = newValue;
            this._value = this.shallow ? newValue : convert(newValue);
            trigger(this, TriggerOrTypes.SET, 'value', newValue)
        }
    }
}

function createRef(rawValue, shallow = false) {
    return new RefImpl(rawValue, shallow);
}

class ObjectRefImpl {
    // 代理到target上，target是响应式的，toRef之后的值，通过代理也是响应式的
    // 如果target不是响应式的，代理后也不是响应式
    public __v_isRef = true;
    constructor(public target, public key) {


    }
    get value() {
        return this.target[this.key]
    }
    set value(newValue) {
        this.target[this.key] = newValue
    }
}
export function toRef(target, key) {
    // 可以把一个对象的值转换成ref
    // 解构响应式对象
    return new ObjectRefImpl(target, key)
}

export function toRefs(target) {
    const ret = isArray(target) ? new Array(target.length) : {};
    for (const key in target) {
        ret[key] = toRef(target, key);
    }
    return ret;
}