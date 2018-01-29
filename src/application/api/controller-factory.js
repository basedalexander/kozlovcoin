import { Injectable, Inject, Container } from 'container-ioc';

@Injectable([Container])
export class ControllerFactory {
    constructor(
        @Inject(Container) container
    ) {
        this._container = container;
    }
    static registry = new Map();

    static register(md, controllerConstructor) {
        ControllerFactory.registry.set(controllerConstructor, { path: md.path, constructor: controllerConstructor});
    }

    create(controllerConstructor) {
        let md = ControllerFactory.registry.get(controllerConstructor);

        if (!md) {
            return null;
        }

        const resolvedController = this._container.resolve(md.constructor);

        return {
            path: md.path,
            controller: resolvedController
        };
    }
}