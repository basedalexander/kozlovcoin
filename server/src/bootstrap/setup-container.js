import { Container } from 'container-ioc';
import {containerConfiguration} from "./container-configuration";

export function setupContainer() {
    const container = new Container();

    container.register(containerConfiguration);

    return container;
}