"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urlValidator = function (req, res, next) {
    // no empty patameters
    if (typeof req.query.filename == 'string' &&
        typeof req.query.width == 'string' &&
        typeof req.query.height == 'string') {
        if (
        // no empty strings
        req.query.filename &&
            parseInt(req.query.width) &&
            parseInt(req.query.height)) {
            // width and height must be at least 10x10
            if (parseInt(req.query.width) >= 10 && parseInt(req.query.height) >= 10) {
                next();
            }
            else {
                res.status(404).send('Wrong Image Size!, image must be at least 10x10');
            }
        }
        else {
            res.status(404).send('Bad Request!');
        }
    }
    else {
        res.status(404).send('Bad Request!');
    }
};
exports.default = urlValidator;
