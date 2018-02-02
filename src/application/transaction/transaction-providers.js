import {TransactionUtilsService} from "./services/transaction-utils.service";
import {TxValidationService} from "./services/tx-validation.service";
import {TransactionPool} from "./transaction-pool/transaction-pool";

export const TRANSACTION_PROVIDERS = [
    TransactionUtilsService,
    TxValidationService,
    TransactionPool
];