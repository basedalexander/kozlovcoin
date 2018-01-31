import {Node} from "./node";
import {NodeManager} from "./node-manager";
import {BlockFactory} from "./block/block-factory";
import {BlockUtilsService} from "./block/block-utils.service";

export const NODE_PROVIDERS = [
    Node,
    NodeManager,

    BlockFactory,
    BlockUtilsService
];