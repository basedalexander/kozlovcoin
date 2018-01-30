import { TWalletRepository } from "./wallet-repository/wallet-repository";
import { LocalWalletRepository } from "./wallet-repository/local-wallet-repository";
import { Wallet } from "./wallet";
import {KeysService} from "./keys.service";
import {WalletManager} from "./wallet-manager";

export const WALLET_PROVIDERS = [
    { token: TWalletRepository, useClass: LocalWalletRepository },
    Wallet,
    KeysService,
    WalletManager
];