const express = require('express');

class Server {
    constructor(config, node) {
        this.config = config;
        this.node = node;
    }

    init() {
        this.app = express();
        this.setupMiddleware(this.app);
        this.setupRouting(this.app);
    }

    setupMiddleware(app) {
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
    }

    setupRouting(app) {
        app.get('/', (req, res) => res.send('Hello World!'));

        app.post('/transaction', (req, res) => {
            node.addTransaction(req.body);
        });

        app.get('/mine', (req, res) => {
            const minedBlock = this.node.mine();

            res.json({
                index: minedBlock.index,
                timeStamp: minedBlock.timeStamp,
                data: minedBlock.data,
                hash: minedBlock.hash
            });
        });
    }

    start() {
        this.app.listen(this.config.port, () => {
            console.log(`Server is listening on port ${this.config.port}`)
        });
    }
}