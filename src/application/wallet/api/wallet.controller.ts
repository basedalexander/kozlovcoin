import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { WalletManager } from '../wallet.manager';
import { MakeTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '../../transaction/classes/transaction';
import { KeyPair } from '../key-generator/key-pair';
import { GetNewKeyPairResponseDTO } from './dto/get-new-key-pair.response.dto';
import { MakeTransactionResponseDto } from './dto/create-transaction-response.dto';
import { GetBalanceResponseDTO } from './dto/get-balance-response.dto';
import { GetHistoryResponseDTO } from './dto/get-history-response.dto';

@ApiUseTags('Kozlovcoin Wallet API')
@Controller('/wallet')
export class WalletController {
    constructor(private manager: WalletManager) {}

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Makes and sends a new transaction to the network. Returns that transaction',
        type: MakeTransactionResponseDto
    })
    @Post('transaction')
    async makeTransaction(@Body() makeTransactioDto: MakeTransactionDto, @Res() res) {

        const result: Transaction = await this.manager.createTransaction({
            recipientPublicKey: makeTransactioDto.recipientPublicKey,
            senderPublicKey: makeTransactioDto.senderPublicKey,
            senderPrivateKey: makeTransactioDto.senderPrivateKey,
            amount: makeTransactioDto.amount
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
        description: 'Returns current balance for provided address',
        type: GetBalanceResponseDTO
    })
    @Get('balance/:address')
    async getBalance(@Param('address') address: string, @Res() res) {

        const balance: number = await this.manager.getBalance(address);

        res.json({
            data: balance
        });
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'NOT IMPLEMENTED. Returns history of sent and received transactions for given address',
        type: GetHistoryResponseDTO
    })
    @Get('history/:address')
    async getHistory(@Param('address') address: string, @Res() res) {

        const result: any[] = await this.manager.getHistory(address);

        res.json({
            data: result
        });
    }
}