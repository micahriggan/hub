"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var request = require("request-promise");
exports.EnvConstants = {
    HUB_NAME: 'hub',
    HUB_PORT: process.env.HUB_PORT || 5555,
    HUB_HOST: process.env.HUB_HOST || 'http://localhost'
};
var defaultUrl = exports.EnvConstants.HUB_HOST + ':' + exports.EnvConstants.HUB_PORT;
var wait = function (time) { return new Promise(function (r) { return setTimeout(r, time); }); };
var HubClient = (function () {
    function HubClient(serviceName, hubUrl) {
        if (hubUrl === void 0) { hubUrl = defaultUrl; }
        this.serviceName = serviceName;
        this.hubUrl = hubUrl;
        this.stopped = false;
        this.request = request;
    }
    HubClient.prototype.ensureConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connected, ping, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connected = false;
                        ping = function () {
                            return request.get(_this.hubUrl + '/ping');
                        };
                        _a.label = 1;
                    case 1:
                        if (!!connected) return [3, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        return [4, ping()];
                    case 3:
                        _a.sent();
                        connected = true;
                        return [3, 6];
                    case 4:
                        e_1 = _a.sent();
                        console.log('waiting for hub to come up @ ', this.hubUrl);
                        return [4, wait(1000)];
                    case 5:
                        _a.sent();
                        return [3, 6];
                    case 6: return [3, 1];
                    case 7: return [2];
                }
            });
        });
    };
    HubClient.prototype.get = function (serviceName) {
        if (serviceName === void 0) { serviceName = this.serviceName; }
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        return [4, request.get(this.hubUrl + ("/service/" + serviceName), { json: true })];
                    case 2:
                        resp = _a.sent();
                        return [2, resp];
                }
            });
        });
    };
    HubClient.prototype.getUrl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.service) return [3, 5];
                        console.log('Waiting for ', this.serviceName);
                        _a = this;
                        return [4, this.get(this.serviceName)];
                    case 1:
                        _a.service = _b.sent();
                        if (!!this.service) return [3, 3];
                        return [4, wait(1000)];
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
    HubClient.prototype.register = function (service) {
        return __awaiter(this, void 0, void 0, function () {
            var name, defaultedService, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = service.name || this.serviceName;
                        if (!name) {
                            throw new Error('service must have a name');
                        }
                        defaultedService = Object.assign({}, { name: name }, service);
                        if (!(name !== exports.EnvConstants.HUB_NAME)) return [3, 2];
                        return [4, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4, request.post(this.hubUrl + "/service", {
                            body: __assign({}, defaultedService),
                            json: true
                        })];
                    case 3:
                        resp = _a.sent();
                        console.log('registered service', this.serviceName);
                        return [2, resp];
                }
            });
        });
    };
    HubClient.prototype.connect = function (service, app) {
        return __awaiter(this, void 0, void 0, function () {
            var registeredService_1, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        registeredService_1 = service;
                        if (!!service.port) return [3, 2];
                        return [4, this.register(service)];
                    case 1:
                        registeredService_1 = _a.sent();
                        _a.label = 2;
                    case 2:
                        this.app = app.listen(registeredService_1.port, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, this.register(service)];
                                    case 1:
                                        registeredService_1 = _a.sent();
                                        console.log(registeredService_1.name, 'listening on port', registeredService_1.port);
                                        return [4, this.startHeartbeat(registeredService_1.name)];
                                    case 2:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); });
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        wait(1000);
                        this.connect(service, app);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    HubClient.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.stopped = true;
                if (this.app) {
                    this.app.removeAllListeners();
                    this.app.close();
                }
                return [2];
            });
        });
    };
    HubClient.prototype.startHeartbeat = function (name) {
        if (name === void 0) { name = this.serviceName; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.stopped) return [3, 3];
                        return [4, this.request.get(this.hubUrl + '/heartbeat/' + name)];
                    case 1:
                        _a.sent();
                        return [4, wait(5000)];
                    case 2:
                        _a.sent();
                        return [3, 0];
                    case 3: return [2];
                }
            });
        });
    };
    return HubClient;
}());
exports.HubClient = HubClient;
//# sourceMappingURL=index.js.map