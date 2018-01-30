import {TxUtilsService} from "./services/tx-utils.service";
import {TxValidationService} from "./services/tx-validation.service";
import {TransactionPool} from "./transaction-pool/transaction-pool";

export const TRANSACTION_PROVIDERS = [
    TxUtilsService,
    TxValidationService,
    TransactionPool
];