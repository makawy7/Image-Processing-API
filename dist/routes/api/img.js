"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var utilities_1 = __importDefault(require("../../utilities/utilities"));
// import path from 'path';
var urlValidator_1 = __importDefault(require("../../middleware/urlValidator"));
var alreadyExists_1 = __importDefault(require("../../middleware/alreadyExists"));
var findImage_1 = __importDefault(require("../../middleware/findImage"));
var img = express_1.default.Router();
img
    .use([urlValidator_1.default, findImage_1.default, alreadyExists_1.default])
    .get('/img', function (req, res) {
    utilities_1.default.preProcessing(res, req.query.filename, parseInt(req.query.width), parseInt(req.query.height));
});
exports.default = img;
