import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import {  ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { GetBlocksResponseDTO } from '../dto/blocks.dto';
import { NodeManager } from '../../node/node-manager';
import { IBlock } from '../../block/block.interface';

@ApiUseTags('node')
@Controller()
export class NodeController {
    constructor(private nodeManager: NodeManager) {}

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns list of blocks',
        type: GetBlocksResponseDTO
    })
    @Get('blocks')
    async getBlocks(@Res() res) {
        const blocks: IBlock[] = await this.nodeManager.getBlocks();

        res.json({
            data: blocks
        });
    }

    @Get('last_block')
    async lastBlock(@Res() res) {
        const block: IBlock = await this.nodeManager.getLastBlock();

        res.json({
            data: block
        });
    }
}