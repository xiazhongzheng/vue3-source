import { isFunction } from "@vue/shared/src";
import { effect, track, trigger } from "./effect";
import { TrackOpTypes, TriggerOrTypes } from "./operators";
class ComputedRefImpl {
    public _value;
    public _dirty = true;
    public effect;
    constructor(getter, public setter) {
        this.effect = effect(getter, {
            lazy: true,
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true;
                    trigger(this, TriggerOrTypes.SET, 'value');
                }
            }
        })

    }
    get value() { // 计算属性搜集依赖  // vue2中计算属性不搜集依赖，是内部引用的属性搜集的
        
        
        if (this._dirty) {
            this._value = this.effect(); // 计算属性是effect，当引用的属性变化时，要触发计算属性的getter执行
            this._dirty = false;
        }
        // 当计算属性在effect中使用时，计算属性的变化，effect也要执行。所以计算属性也要做成响应式
        track(this, TrackOpTypes.GET, 'value');
        return this._value;
    }
    set value(newValue) {
        this.setter(newValue);
    }
}
export function computed(getterOrOptions) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => {
            console.warn('computed  value must be readonly')
        }
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter);
}