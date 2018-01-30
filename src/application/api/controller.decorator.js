import { ControllerFactory } from "./controller-factory";

export function Controller(md) {
    return function (target) {
        ControllerFactory.register(md, target);
    }
}