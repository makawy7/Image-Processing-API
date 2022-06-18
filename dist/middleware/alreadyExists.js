"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var image_size_1 = __importDefault(require("image-size"));
var fs_1 = require("fs");
var fs_2 = __importDefault(require("fs"));
var alreadyExists = function (req, res, next) {
    var filename = req.query.filename;
    var imagesPath = path_1.default.resolve("./assets/images/");
    var imagePath = "".concat(imagesPath, "/").concat(filename, "_thumb.jpg");
    // check if image was previously resized
    if (fs_2.default.existsSync(imagePath)) {
        var width = parseInt(req.query.width);
        var height = parseInt(req.query.height);
        var size = (0, image_size_1.default)(imagePath);
        // check if image was previously resized to the same width and height
        if (size.width == width && size.height == height) {
            // read the existing Image and don't re-resize it
            fs_1.promises
                .readFile("".concat(imagesPath, "/").concat(req.query.filename, "_thumb.jpg"))
                .then(function (c) {
                // return the image
                res.status(202).end(c);
            });
        }
        else {
            // it's same picture but different sizes
            // resize to the new choosen size and override the current one
            next();
        }
    }
    else {
        // the image was not previously resized
        next();
    }
};
exports.default = alreadyExists;
