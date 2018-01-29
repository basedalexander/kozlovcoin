import { TWalletRepository } from "./wallet-repository/wallet-repository";
import { LocalWalletRepository } from "./wallet-repository/local-wallet-repository";
import { Wallet } from "./wallet";
import {KeysService} from "./keys.service";

export const WALLET_PROVIDERS = [
    { token: TWalletRepository, useClass: LocalWalletRepository },
    Wallet,
    KeysService
];