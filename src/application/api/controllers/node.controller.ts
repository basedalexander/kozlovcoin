import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import {  ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { GetBlocksResponseDTO } from '../dto/get-blocks-response.dto';
import { NodeManager } from '../../node/node-manager';
import { IBlock } from '../../block/block.interface';
import { GetLastBlockResponseDTO } from '../dto/get-last-block-response.dto';
import { GetUnspentTxOutputsResponseDto } from '../dto/get-unspent-tx-outputs-response.dto';
import { UnspentTransactionOutput } from '../../transaction/classes/unspent-transaction-output';

@ApiUseTags('Node API')
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
    @Get('last-block')
    async lastBlock(@Res() res) {
        const block: IBlock = await this.nodeManager.getLastBlock();

        res.json({
            data: block
        });
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns list of unspent transaction outputs',
        type: GetUnspentTxOutputsResponseDto
    })
    @Get('unspent-tx-outputs')
    async getUnspentTransactionOutputs(@Res() res) {
        const result: UnspentTransactionOutput[] = await this.nodeManager.getUnspentTxOutputs();

        res.json({
            data: result
        });
    }
}