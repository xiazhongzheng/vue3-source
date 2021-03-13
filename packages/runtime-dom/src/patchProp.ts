import { patchAttr } from "./modules/attr";
import { patchClass } from "./modules/class";
import { patchEvents } from "./modules/events";
import { patchStyle } from "./modules/style";

// 属性操作
export const PatchProp = (el, key, prevProp, nextProp) => {
    switch (key) {
        case 'class':
            patchClass(el, nextProp);
            break;
        case 'style':
            patchStyle(el, prevProp, nextProp);
            break;

        default:
            if (/^on[^a-z]/.test(key)) {
                patchEvents(el, key, nextProp);
            } else {
                patchAttr(el, key, nextProp);
            }

            break;
    }
}