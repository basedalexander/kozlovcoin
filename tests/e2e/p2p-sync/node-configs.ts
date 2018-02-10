//tslint:disable

export const HOST: string = 'localhost';

export const nodeAConfig = {
    "server": {
        "host": HOST,
        "port": 4001
    },
    "p2p": {
        "host": HOST,
        "port": 6001,
        "peers": []
    }
};

export const nodeBConfig = {
    "server": {
        "host": HOST,
        "port": 4002
    },
    "p2p": {
        "host": HOST,
        "port": 6002,
        "peers": []
    }
};

export const nodeCConfig = {
    "server": {
        "host": HOST,
        "port": 4003
    },
    "p2p": {
        "host": HOST,
        "port": 6003,
        "peers": []
    }
};