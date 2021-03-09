import { isArray, isIntegerKey } from "@vue/shared/src";
import { TriggerOrTypes } from "./operators";

export function effect(fn, options: any = {}) {
    const effect = createReactiveEffect(fn, options);

    if (!options.lazy) {
        effect();
    }
    return effect;
}
let uid = 0;
let activeEffect; // 当前effect
const effectStack = []; // effect可能嵌套，栈结构保存嵌套关系

function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) { // 不重复加effect
            try {
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            } finally { // ......
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    }
    effect.id = uid++; // 标识 区分effect和排序
    effect._isEffect = true;
    effect.raw = fn; // 原本的函数
    effect.options = options;

    return effect;
}
const targetMap = new WeakMap();

// 搜集依赖
export function track(target, type, key) {
    if (activeEffect === undefined) { // 没使用，不搜集
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, depsMap = new Map);
    }
    let keySet = depsMap.get(key);
    if (!keySet) {
        depsMap.set(key, keySet = new Set);
    }
    if (!keySet.has(activeEffect)) {
        keySet.add(activeEffect);
    }
    console.log(depsMap)
}

// 触发更新
export function trigger(target, type, key?, newValue?, oldValue?) {
    // console.log(target)
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    // 先放到一起，最终统一执行
    const effects = new Set();
    const add = (effectsToAdd) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                effects.add(effect);
            });
        }
    }
    if (key === 'length' && isArray(target)) { // 如果修改的属性是数组的length
        depsMap.forEach((dep, key) => { // key是搜集依赖时的属性
            if (key === 'length' || key > newValue) {
                // 如果搜集依赖时是length或者数组的某个值大于后来修改的length
                add(dep)
            }
        });

    } else {
        // 修改对象或数组的索引
        if(key !== undefined){
            add(depsMap.get(key));
        }
        switch(type) {
            case TriggerOrTypes.ADD:
                if (isArray(target) && isIntegerKey(key)) {
                    // 如果修改了索引，导致数组增加
                    // 就触发length的搜集   使用一个数组也会触发length的搜集
                    add(depsMap.get('length'));
                }
        }

    }
    effects.forEach((effect: any) => {
        // console.log(1111, effect)
        // console.log(effect.id)
        // console.log(effect.options)
        if (effect.options.scheduler) {
            effect.options.scheduler();
        } else {
            effect();
        }
    });
}