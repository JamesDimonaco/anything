"use strict";
// A custom https://www.mixamo.com/ animation loader for GLTF
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// first we look at Downloads for new .fbx files
// then we use the FBX2GLTF converter (https://github.com/godotengine/FBX2glTF) to convert them to .gltf
var fs = require("fs/promises");
var child_process_1 = require("child_process");
var util_1 = require("util");
var DOWNLOADS_PATH = "/Users/jamielegg/Downloads/";
var OUTPUT_PATH = "./apps/web/public/gltf/";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var newGLTFs, existingGLTF, newAnimations, newBuffers, existingAnimations, updatedAnimations, _loop_1, _i, newAnimations_1, newAnimation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getNewGLTFs()];
                case 1:
                    newGLTFs = (_a.sent());
                    return [4 /*yield*/, getExistingGLTF()];
                case 2:
                    existingGLTF = (_a.sent());
                    // first we need to extract the buffers from the new gltfs
                    // and index them appropriately
                    console.log(existingGLTF.buffers);
                    newAnimations = [];
                    newBuffers = [];
                    existingAnimations = existingGLTF.animations;
                    updatedAnimations = [];
                    _loop_1 = function (newAnimation) {
                        if (!existingAnimations.some(function (ea) { return ea.name === newAnimation.name; })) {
                            updatedAnimations.push(newAnimation);
                        }
                    };
                    for (_i = 0, newAnimations_1 = newAnimations; _i < newAnimations_1.length; _i++) {
                        newAnimation = newAnimations_1[_i];
                        _loop_1(newAnimation);
                    }
                    existingGLTF.animations = __spreadArray(__spreadArray([], existingAnimations, true), updatedAnimations, true);
                    existingGLTF.buffers = __spreadArray(__spreadArray([], existingGLTF.buffers, true), newBuffers, true);
                    return [2 /*return*/];
            }
        });
    });
}
function getNewGLTFs() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var gltfs, directory, _d, directory_1, directory_1_1, file, gltf, e_1_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    gltfs = [];
                    return [4 /*yield*/, fs.opendir(DOWNLOADS_PATH)];
                case 1:
                    directory = _e.sent();
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 8, 9, 14]);
                    _d = true, directory_1 = __asyncValues(directory);
                    _e.label = 3;
                case 3: return [4 /*yield*/, directory_1.next()];
                case 4:
                    if (!(directory_1_1 = _e.sent(), _a = directory_1_1.done, !_a)) return [3 /*break*/, 7];
                    _c = directory_1_1.value;
                    _d = false;
                    file = _c;
                    if (!file.name.endsWith(".fbx")) return [3 /*break*/, 6];
                    return [4 /*yield*/, convertFBXtoGLTF(file.name)];
                case 5:
                    gltf = _e.sent();
                    // rename the animation to the file name
                    if (gltf.animations[0]) {
                        gltf.animations[0].name = file.name
                            .toLowerCase()
                            .replace(" ", "_")
                            .replace(".fbx", "");
                    }
                    gltfs.push(gltf);
                    _e.label = 6;
                case 6:
                    _d = true;
                    return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _e.trys.push([9, , 12, 13]);
                    if (!(!_d && !_a && (_b = directory_1.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _b.call(directory_1)];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/, gltfs];
            }
        });
    });
}
function convertFBXtoGLTF(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var command, _a, stdout, stderr, fullPath, gltf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // exec the Unix command to convert the file
                    //! I opted to move fbx2gltf to my path
                    // clean the file name
                    fileName = fileName.replace(/\s/g, "\\ ");
                    command = "fbx2gltf ".concat(DOWNLOADS_PATH).concat(fileName, " -o ").concat(OUTPUT_PATH).concat(fileName.toLowerCase().replace(".fbx", ""));
                    return [4 /*yield*/, (0, util_1.promisify)(child_process_1.exec)(command)];
                case 1:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    // stdout
                    // Wrote 79823 bytes of glTF to ./{FILE}_out/{FILE}.gltf.
                    // Wrote 1682428 bytes of binary data to ./{FILE}_out/buffer.bin.
                    // the file wont have .fbx anymore
                    // restore spaces and remove the .fbx
                    fileName = fileName.replace(/\\ /g, " ").replace(".fbx", "");
                    fullPath = "".concat(fileName, "_out/").concat(fileName, ".gltf");
                    return [4 /*yield*/, getGLTF(fullPath)];
                case 2:
                    gltf = _b.sent();
                    return [2 /*return*/, gltf];
            }
        });
    });
}
function getExistingGLTF() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(process.cwd());
                    return [4 /*yield*/, getGLTF("./apps/web/public/gltf/char.gltf")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getGLTF(fullPath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs.readFile(fullPath, "utf-8")];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        });
    });
}
main()
    .then(function () {
    console.log("done");
})
    .catch(function (err) {
    console.error(err);
});
