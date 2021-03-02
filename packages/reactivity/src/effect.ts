import { isFunctionDeclaration } from "typescript";

export function effect(fn, options: any = {}) {
    const effect = createReactiveEffect(fn, options);

    if (!options.lazy) {
        effect();
    }
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
            } catch (error) {
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
}
