import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import {  ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { GetBlocksResponseDTO } from '../dto/get-blocks-response.dto';
import { NodeManager } from '../../node/node-manager';
import { IBlock } from '../../block/block.interface';
import { GetLastBlockResponseDTO } from '../dto/get-last-block-response.dto';

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
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns the last block in the blockchain',
        type: GetLastBlockResponseDTO
    })
    @Get('last_block')
    async lastBlock(@Res() res) {
        const block: IBlock = await this.nodeManager.getLastBlock();

        res.json({
            data: block
        });
    }
}