"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.hasDatabaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const hasDatabaseConnection = () => mongoose_1.default.connection.readyState === 1;
exports.hasDatabaseConnection = hasDatabaseConnection;
const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.warn('MONGO_URI no configurado. ControlTaco iniciara en modo demo sin base de datos.');
        return;
    }
    try {
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.warn(`No se pudo conectar a MongoDB. ControlTaco continuara en modo demo: ${error}`);
    }
};
exports.connectDB = connectDB;
