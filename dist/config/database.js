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
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.initalizeMongo = void 0;
const mongodb_1 = require("mongodb");
let client;
function initalizeMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mongoURL = process.env.URL || "";
            exports.client = client = new mongodb_1.MongoClient(mongoURL);
            yield client.connect();
            console.log("Connected to Mongodb Database");
        }
        catch (error) {
            console.error("Error connecting a Database:", error);
            throw error;
        }
    });
}
exports.initalizeMongo = initalizeMongo;
