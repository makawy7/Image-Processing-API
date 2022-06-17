"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var image_size_1 = __importDefault(require("image-size"));
var fs_1 = require("fs");
var imagesPath = path_1.default.resolve("./assets/images/");
var files = [];
var alreadyExists = function (req, res, next) {
    // get all images names inside the images folder
    fs_1.promises
        .readdir(imagesPath)
        .then(function (filenames) {
        for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
            var filename = filenames_1[_i];
            files.push(filename);
        }
        // check if image was previously resized
        if (files.includes("".concat(req.query.filename, "_thumb.jpg"))) {
            var width = parseInt("".concat(req.query.width));
            var height = parseInt("".concat(req.query.height));
            var size = (0, image_size_1.default)("".concat(imagesPath, "/").concat(req.query.filename, "_thumb.jpg"));
            // check if image was previously resized to the same width and height
            if (size.width == width && size.height == height) {
                // read the existing Image and don't re-resize it
                fs_1.promises
                    .readFile("".concat(imagesPath, "/").concat(req.query.filename, "_thumb.jpg"))
                    .then(function (c) {
                    res.status(202).end(c);
                });
            }
            // it's same picture but different sizes
            // resize to the new choosen size and override the current one
            next();
        }
        else {
            // the image was not previously resized
            next();
        }
    })
        .catch(function (err) {
        res.send(err);
    });
};
exports.default = alreadyExists;
