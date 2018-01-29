import {Injectable} from "container-ioc";
import { ec } from 'elliptic';
const EC = new ec('secp256k1');

@Injectable()
export class KeysService {
    privateToPublic(privateKey) {
        return ec.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex');
    }

    generatePrivateKey() {
        const keyPair = EC.genKeyPair();
        const privateKey = keyPair.getPrivate();
        return privateKey.toString(16);
    }
}