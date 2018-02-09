import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import {  ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { GetBlocksResponseDTO } from './dto/get-blocks-response.dto';
import { NodeManager } from '../../../node/node-manager';
import { IBlock } from '../../../block/block.interface';
import { GetLastBlockResponseDTO } from './dto/get-last-block-response.dto';
import { GetUnspentTxOutputsResponseDto } from './dto/get-unspent-tx-outputs-response.dto';
import { UnspentTransactionOutput } from '../../../transaction/classes/unspent-transaction-output';
import { Transaction } from '../../../transaction/classes/transaction';
import { GetTransactionPoolResponseDto } from './dto/get-transaction-pool-response.dto';
import { ErrorResponseDTO } from './error-response.dto';
import { AddPeerDTO } from './dto/add-peer-dto';
import { GetPeersResponseDto } from './dto/get-peers-response.dto';

@ApiUseTags('Node API')
@ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `Bad request data`,
    type: ErrorResponseDTO
})
@ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: `Validation error`,
    type: ErrorResponseDTO
})
@ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: `Internal server error.`,
    type: ErrorResponseDTO
})
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns list of transactions from transaction pool',
        type: GetTransactionPoolResponseDto
    })
    @Get('tx-pool')
    async getTransactionPool(@Res() res) {
        const result: Transaction[] = await this.nodeManager.getTxPool();

        res.json({
            data: result
        });
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns empty body'
    })
    @Post('peer')
    async addPeer(@Body() addPeerDTO: AddPeerDTO, @Res() res) {
        await this.nodeManager.addPeer(addPeerDTO.address);

        res.json({

        });
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns an array of peer addresses',
        type: GetPeersResponseDto
    })
    @Get('peers')
    async getPeers(@Res() res) {
        const result = await this.nodeManager.getPeers();

        res.json({
            data: result
        });
    }
}