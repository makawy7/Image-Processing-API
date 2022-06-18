"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var index_1 = __importDefault(require("../index"));
var fs_1 = require("fs");
var fs_2 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var utilities_1 = __importDefault(require("../utilities/utilities"));
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
    describe('Utilities', function () {
        var imgPath = path_1.default.resolve("./assets/images/encenadaport.jpg");
        var newImgPath = path_1.default.resolve("./assets/images/encenadaport_thumb.jpg");
        var width = 200;
        var height = 200;
        it('imageResize has to be resolved with no errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expectAsync(utilities_1.default.imageResize(imgPath, newImgPath, width, height)).toBeResolved()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('The resized image has been generated successfully in assets folder', function () {
            expect(fs_2.default.existsSync(newImgPath)).toBe(true);
        });
    });
});
