"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var index_1 = __importDefault(require("../index"));
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var imagesPath = path_1.default.resolve("./assets/images/");
var files = [];
describe('Server', function () {
    afterAll(function () {
        index_1.default.close();
    });
    // delete all previously resized images before running the test
    beforeAll(function () {
        fs_1.promises.readdir(imagesPath).then(function (filenames) {
            for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
                var filename = filenames_1[_i];
                files.push(filename);
            }
            remove(files);
        });
        function remove(files) {
            files.forEach(function (filename) {
                if (filename.includes('_thumb')) {
                    fs_1.promises.unlink("".concat(imagesPath, "/").concat(filename));
                }
            });
        }
    });
    describe('Server status', function () {
        var status = 0;
        beforeEach(function (done) {
            request_1.default.get('http://localhost:3000/', function (error, response) {
                status = response.statusCode;
                done();
            });
        });
        it('server is working, and returns status code 200', function () {
            expect(status).toBe(200);
        });
    });
    describe('URL validation', function () {
        var parametersStatus = 0;
        var dimensionCheck = 0;
        var existStatus = 0;
        beforeEach(function (done) {
            request_1.default.get('http://localhost:3000/api/img?filename=&width=&height=', function (error, response) {
                parametersStatus = response.statusCode;
                done();
            });
        });
        it("/api/img doesn't accept any empty parameter [filename, width, height]", function () {
            expect(parametersStatus).toBe(404);
        });
        beforeEach(function (done) {
            request_1.default.get('http://localhost:3000/api/img?filename=any&width=200&height=5', function (error, response) {
                dimensionCheck = response.statusCode;
                done();
            });
        });
        it('Width or height must be at least 10x10px', function () {
            expect(dimensionCheck).toBe(404);
        });
        beforeEach(function (done) {
            request_1.default.get('http://localhost:3000/api/img?filename=notfound&width=200&height=200', function (error, response) {
                existStatus = response.statusCode;
                done();
            });
        });
        it('filename has to be of an existent image inside assets folder', function () {
            expect(existStatus).toBe(404);
        });
    });
    describe('Image Processing', function () {
        var processStatus = 0;
        beforeEach(function (done) {
            request_1.default.get('http://localhost:3000/api/img?filename=encenadaport&width=200&height=200', function (error, response) {
                processStatus = response.statusCode;
                done();
            });
        });
        it("resize the image of it was't previously resized to the same width and height", function () {
            expect(processStatus).toBe(201);
        });
    });
});
