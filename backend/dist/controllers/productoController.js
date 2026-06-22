"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProducto = exports.getProductos = void 0;
const Producto_1 = __importDefault(require("../models/Producto"));
const getProductos = async (req, res) => {
    try {
        const productos = await Producto_1.default.find().populate('categoria');
        res.json(productos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
};
exports.getProductos = getProductos;
const createProducto = async (req, res) => {
    try {
        const { nombre, precio, categoria, ingredientes, disponible } = req.body;
        const nuevoProducto = new Producto_1.default({ nombre, precio, categoria, ingredientes, disponible });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error });
    }
};
exports.createProducto = createProducto;
