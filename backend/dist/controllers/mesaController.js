"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMesaStatus = exports.createMesa = exports.getMesas = void 0;
const Mesa_1 = __importDefault(require("../models/Mesa"));
const db_1 = require("../config/db");
const demoMesas = [
    { _id: 'demo-1', numero: 1, capacidad: 4, estado: 'Disponible' },
    { _id: 'demo-2', numero: 2, capacidad: 2, estado: 'Ocupada' },
    { _id: 'demo-3', numero: 3, capacidad: 6, estado: 'Reservada' },
    { _id: 'demo-4', numero: 4, capacidad: 4, estado: 'Disponible' },
    { _id: 'demo-5', numero: 5, capacidad: 8, estado: 'Disponible' },
];
const getMesas = async (req, res) => {
    try {
        if (!(0, db_1.hasDatabaseConnection)()) {
            res.json(demoMesas);
            return;
        }
        const mesas = await Mesa_1.default.find();
        res.json(mesas.length > 0 ? mesas : demoMesas);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener mesas', error });
    }
};
exports.getMesas = getMesas;
const createMesa = async (req, res) => {
    try {
        const { numero, capacidad } = req.body;
        if (!(0, db_1.hasDatabaseConnection)()) {
            const nuevaMesa = {
                _id: `demo-${Date.now()}`,
                numero,
                capacidad,
                estado: 'Disponible',
            };
            demoMesas.push(nuevaMesa);
            res.status(201).json(nuevaMesa);
            return;
        }
        const nuevaMesa = new Mesa_1.default({ numero, capacidad });
        await nuevaMesa.save();
        res.status(201).json(nuevaMesa);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear mesa', error });
    }
};
exports.createMesa = createMesa;
const updateMesaStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        if (!(0, db_1.hasDatabaseConnection)()) {
            const mesa = demoMesas.find((item) => item._id === id);
            if (!mesa) {
                res.status(404).json({ message: 'Mesa no encontrada' });
                return;
            }
            mesa.estado = estado;
            res.json(mesa);
            return;
        }
        const mesaActualizada = await Mesa_1.default.findByIdAndUpdate(id, { estado }, { new: true });
        if (!mesaActualizada) {
            res.status(404).json({ message: 'Mesa no encontrada' });
            return;
        }
        res.json(mesaActualizada);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar mesa', error });
    }
};
exports.updateMesaStatus = updateMesaStatus;
