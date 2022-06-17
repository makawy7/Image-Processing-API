"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = require("fs");
var imagesPath = path_1.default.resolve("./assets/images/");
var files = [];
var findImage = function (req, res, next) {
    fs_1.promises
        .readdir(imagesPath)
        .then(function (filenames) {
        for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
            var filename = filenames_1[_i];
            files.push(filename);
        }
        if (files.includes("".concat(req.query.filename, ".jpg"))) {
            // image already exist in /assets/images/ folder
            next();
        }
        else {
            // image non existent
            res.status(404).send('Image not found!');
        }
    })
        .catch(function (err) {
        res.send(err);
    });
};
exports.default = findImage;
