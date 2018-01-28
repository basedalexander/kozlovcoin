import express from 'express';
import swagger from 'swagger-node-express';
import path from 'path';
import { Injectable, Inject } from 'container-ioc';
import {TLogger} from "../system/logger/logger";

@Injectable([TLogger])
export class Swagger {
    constructor(
        @Inject(TLogger) logger
    ) {
        this.logger = logger;
    }

    init(app) {
        const argv = require('minimist')(process.argv.slice(2));

        const subPath = express();
        const swgr = swagger.createNew(subPath);
        const uiDirPath = path.join(__dirname, '../../swagger-ui');
        subPath.use(express.static(uiDirPath));

        subPath.get('/', function (req, res) {
            res.sendFile(uiDirPath + '/index.html');
        });

        swgr.setApiInfo({
            title: "Blockchain API",
            description: "API for Scroogecoin",
            termsOfServiceUrl: "",
            contact: "itrefak@gmail.com",
            license: "",
            licenseUrl: ""
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

        app.use('/api-docs', subPath);
    }
}