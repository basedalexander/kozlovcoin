import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import swagger from 'swagger-node-express';

export class Server {
    constructor(config, node, logger) {
        this._config = config;
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

        this.setupSwagger(this.app);
    }

    setupSwagger(app) {
        const argv = require('minimist')(process.argv.slice(2));

        const subPath = express();
        app.use('/v1', subPath);
        const swgr = swagger.createNew(subPath);

        const uiDirPath = path.join(__dirname, '../../swagger-ui');

        app.use(express.static(uiDirPath));

        swgr.setApiInfo({
            title: "example API",
            description: "API to do something, manage something...",
            termsOfServiceUrl: "",
            contact: "yourname@something.com",
            license: "",
            licenseUrl: ""
        });

        app.get('/', function (req, res) {
            res.sendFile(uiDirPath + '/index.html');
        });

        // Set api-doc path
        swgr.configureSwaggerPaths('', 'api-docs', '');

        // Configure the API domain
        let domain = 'localhost';

        if (argv.domain !== undefined)
            domain = argv.domain;
        else {
            this.logger.log('No --domain=xxx specified, taking default hostname "localhost".');
        }

        // Configure the API port
        let port = 8080;
        if(argv.port !== undefined) {
            port = argv.port;
        }
        else {
            this.logger.log('No --port=xxx specified, taking default port ' + port + '.');
        }

        // Set and display the application URL
        const applicationUrl = 'http://' + domain + ':' + port;
        this.logger.log('snapJob API running on ' + applicationUrl);


        swgr.configure(applicationUrl, '1.0.0');
    }

    setupRouting(app) {
        // app.get('/', (req, res) => res.send('Hey'));

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

        app.get('/blocks', (req, res) => {
            const chain = this.node.getBlockchain();
            res.json(chain);
        });
    }

    start() {
        this.app.listen(this._config.port, () => {
            this.logger.log(`Server is listening on port ${this._config.port}`)
        });
    }
}