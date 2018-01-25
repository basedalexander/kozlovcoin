import express from 'express';
import bodyParser from 'body-parser';

export class Server {
    constructor(config, node, logger) {
        this.config = config;
        this.node = node;
        this.logger = logger;

        this.init();
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
        app.get('/', (req, res) => res.send('Hey'));

        app.post('/transaction', (req, res) => {
            this.node.addTransaction(req.body);
            res.end();
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
            this.logger.log(`Server is listening on port ${this.config.port}`)
        });
    }
}