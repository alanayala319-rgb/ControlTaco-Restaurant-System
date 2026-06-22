"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cobrarCuenta = exports.getPedidosPorCuenta = exports.crearPedido = exports.abrirCuenta = void 0;
const Pedido_1 = __importDefault(require("../models/Pedido"));
const Cuenta_1 = __importDefault(require("../models/Cuenta"));
const Mesa_1 = __importDefault(require("../models/Mesa"));
const Pago_1 = __importDefault(require("../models/Pago"));
// 1. Abrir una cuenta en una mesa
const abrirCuenta = async (req, res) => {
    try {
        const { mesaId } = req.body;
        // Verificar si la mesa ya tiene una cuenta abierta
        const cuentaAbierta = await Cuenta_1.default.findOne({ mesa: mesaId, estado: 'Abierta' });
        if (cuentaAbierta) {
            res.status(400).json({ message: 'La mesa ya tiene una cuenta abierta' });
            return;
        }
        const nuevaCuenta = new Cuenta_1.default({ mesa: mesaId, estado: 'Abierta' });
        await nuevaCuenta.save();
        // Actualizar estado de la mesa
        await Mesa_1.default.findByIdAndUpdate(mesaId, { estado: 'Ocupada' });
        res.status(201).json(nuevaCuenta);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al abrir cuenta', error });
    }
};
exports.abrirCuenta = abrirCuenta;
// 2. Crear un pedido para una cuenta
const crearPedido = async (req, res) => {
    try {
        const { cuentaId, meseroId, detalles } = req.body;
        const cuenta = await Cuenta_1.default.findById(cuentaId);
        if (!cuenta || cuenta.estado === 'Cerrada') {
            res.status(400).json({ message: 'Cuenta no válida o cerrada' });
            return;
        }
        const nuevoPedido = new Pedido_1.default({
            cuenta: cuentaId,
            mesero: meseroId,
            detalles,
            estado_general: 'Pendiente'
        });
        await nuevoPedido.save();
        res.status(201).json(nuevoPedido);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear pedido', error });
    }
};
exports.crearPedido = crearPedido;
// 3. Obtener pedidos de una cuenta
const getPedidosPorCuenta = async (req, res) => {
    try {
        const { cuentaId } = req.params;
        const pedidos = await Pedido_1.default.find({ cuenta: cuentaId }).populate('detalles.producto');
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener pedidos', error });
    }
};
exports.getPedidosPorCuenta = getPedidosPorCuenta;
// 4. Cobrar la cuenta (Crear Pago y Cerrar Cuenta)
const cobrarCuenta = async (req, res) => {
    try {
        const { cuentaId, monto_total, metodo_pago } = req.body;
        const cuenta = await Cuenta_1.default.findById(cuentaId);
        if (!cuenta || cuenta.estado === 'Cerrada') {
            res.status(400).json({ message: 'Cuenta no válida o ya está cerrada' });
            return;
        }
        // Crear el registro de pago
        const nuevoPago = new Pago_1.default({
            cuenta: cuentaId,
            monto_total,
            metodo_pago
        });
        await nuevoPago.save();
        // Cerrar cuenta y liberar mesa
        cuenta.estado = 'Cerrada';
        cuenta.fecha_cierre = new Date();
        await cuenta.save();
        await Mesa_1.default.findByIdAndUpdate(cuenta.mesa, { estado: 'Disponible' });
        await Pedido_1.default.updateMany({ cuenta: cuentaId }, { estado_general: 'Pagado' });
        res.status(200).json({ message: 'Cuenta cobrada exitosamente', pago: nuevoPago });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al cobrar cuenta', error });
    }
};
exports.cobrarCuenta = cobrarCuenta;
