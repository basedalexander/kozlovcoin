import * as express from "express";

export class BaseController {
    constructor() {
        this._router = express.Router();
        this.init();
    }

    get router() {
        return this._router;
    }
}