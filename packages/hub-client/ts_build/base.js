"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var BaseClient = (function () {
    function BaseClient(serviceName, envUrl) {
        this.serviceName = serviceName;
        this.envClient = new _1.DecentEnvClient(envUrl);
    }
    BaseClient.prototype.getUrl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.service) return [3, 5];
                        console.log('Waiting for ', this.serviceName);
                        _a = this;
                        return [4, this.envClient.get(this.serviceName)];
                    case 1:
                        _a.service = _b.sent();
                        if (!!this.service) return [3, 3];
                        return [4, new Promise(function (r) { return setTimeout(r, 1000); })];
                    case 2:
                        _b.sent();
                        return [3, 4];
                    case 3:
                        console.log('Service retrieved', this.service);
                        _b.label = 4;
                    case 4: return [3, 0];
                    case 5: return [2, this.service.url];
                }
            });
        });
    };
    BaseClient.prototype.register = function (service) {
        console.log('Registering service', this.serviceName);
        var srv = Object.assign({}, { name: this.serviceName }, service);
        return this.envClient.register(srv);
    };
    BaseClient.prototype.get = function () {
        console.log('Getting service', this.service);
        return this.envClient.get(this.serviceName);
    };
    return BaseClient;
}());
exports.BaseClient = BaseClient;
//# sourceMappingURL=base.js.map