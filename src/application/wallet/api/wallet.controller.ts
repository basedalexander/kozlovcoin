import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { WalletManager } from '../wallet.manager';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '../../transaction/classes/transaction';
import { KeyPair } from '../key-generator/key-pair';
import { GetNewKeyPairResponseDTO } from './dto/get-new-key-pair.response.dto';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';
import { GetBalanceResponseDTO } from './dto/get-balance-response.dto';

@ApiUseTags('Kozlovcoin Wallet API')
@Controller('/wallet')
export class WalletController {
    constructor(private manager: WalletManager) {}

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Creates and sends new transaction. Returns newly created transaction',
        type: CreateTransactionResponseDto
    })
    @Post('transaction')
    async sendTransaction(@Body() createTxParams: CreateTransactionDto, @Res() res) {

        const result: Transaction = await this.manager.createTransaction({
            recipientPublicKey: createTxParams.recipientPublicKey,
            senderPublicKey: createTxParams.senderPublicKey,
            senderPrivateKey: createTxParams.senderPrivateKey,
            amount: createTxParams.amount
        });

        res.json({
            data: result
        });
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns newly generated pair of keys',
        type: GetNewKeyPairResponseDTO
    })
    @Get('new-key-pair')
    async generateKeyPair(@Res() res) {
        const result: KeyPair = await this.manager.generateNewKeyPair();

        res.json({
            data: result
        });
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns current balance for provided public key',
        type: GetBalanceResponseDTO
    })
    @Get('balance/:key')
    async getBalance(@Param('key') key: string, @Res() res) {

        const balance: number = await this.manager.getBalance(key);

        res.json({
            data: balance
        });
    }
}