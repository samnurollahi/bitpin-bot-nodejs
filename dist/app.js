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
exports.Bot = void 0;
const axios_1 = __importDefault(require("axios"));
class Bot {
    constructor(token) {
        this.token = token;
        this._client = axios_1.default.create({
            headers: {
            // Authorization: `Token ${token}`,
            },
        });
        // interface
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
                return [
                    {
                        status: result.status,
                    },
                ];
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
            symbol: false,
            name: false,
            price: false,
            tradable: false,
        }) {
        });
    }
}
exports.Bot = Bot;
// const rastin = new Bot("6592f92ea8fe12320a2fb29d39cd9944dd08b465");
// rastin.getCurrencies();
// 6592f92ea8fe12320a2fb29d39cd9944dd08b465
