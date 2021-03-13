//  用户调用runtime-dom -> runtime-core


import { extend } from "@vue/shared/src";
import { nodeOps } from "./nodeOps";
import { PatchProp } from "./patchProp";

// 把PatchProp方法，和nodeOps对象里面的方法，统一放到rendererOptions
const rendererOptions = extend({PatchProp}, nodeOps);
