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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Bot {
    constructor(token) {
        this.token = token;
        this._client = axios_1.default.create({
            headers: {
            // Authorization: `Token ${token}`,
            },
        });
    }
    // get all name currencies
    getCurrencies() {
        return __awaiter(this, arguments, void 0, function* (config = {
            tradable: true,
            limit: false,
            sort: "asc",
            currency: false,
            name: false,
        }) {
            let result = yield this._client.get("https://api.bitpin.org/api/v1/mkt/currencies/"); // get data
            let data = result.data;
            // check status code
            if (result.status != 200) {
                console.log(result.status);
            }
            if (config.sort == "desc") {
                data = data.reverse();
            }
            if (config.tradable) {
                data = data.filter((item) => {
                    return item.tradable ? item : false;
                });
            }
            if (config.limit) {
                data = data.slice(0, config.limit);
                // console.log(typeof data);
            }
            if (config.name) {
                data = data.filter((item) => {
                    return item.name.toLocaleLowerCase() == config.name.toLocaleLowerCase()
                        ? item
                        : false;
                });
            }
            if (config.currency) {
                data = data.filter((item) => {
                    return item.currency.toLocaleLowerCase() ==
                        config.currency.toLocaleLowerCase()
                        ? item
                        : false;
                });
            }
            return data;
        });
    }
    // currencie
    getCurrencie() {
        return __awaiter(this, arguments, void 0, function* (config = {
            currency: false,
            name: false,
            price: false,
            to: false,
        }) {
            const result = yield this._client.get("https://api.bitpin.org/api/v1/mkt/tickers/");
            let data = result.data;
            if (result.status != 200) {
                console.log(result.status);
            }
            if (config.to) {
                data = data.filter(item => {
                    return item.symbol.split("_")[1] == config.to ? item : false;
                });
            }
            if (config.currency) {
                data = data.filter((item) => {
                    return item.symbol.split("_")[0] == config.currency ? item : false;
                });
            }
            else if (config.name) {
                const target = yield this.getCurrencies({
                    name: config.name,
                });
                data = data.filter((item) => {
                    return item.symbol.split("_")[0] == target[0].currency ? item : false;
                });
            }
            if (config.price) {
                data = data.filter(item => {
                    var _a;
                    let price = (_a = config.price) !== null && _a !== void 0 ? _a : 0;
                    return item.price > price ? item : false;
                });
            }
            return data;
        });
    }
}
exports.default = Bot;
const rastin = new Bot("6592f92ea8fe12320a2fb29d39cd9944dd08b465");
