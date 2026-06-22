import { Request, Response } from 'express';
import Pedido from '../models/Pedido';
import Cuenta from '../models/Cuenta';
import Mesa from '../models/Mesa';
import Pago from '../models/Pago';

// 1. Abrir una cuenta en una mesa
export const abrirCuenta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mesaId } = req.body;
    
    // Verificar si la mesa ya tiene una cuenta abierta
    const cuentaAbierta = await Cuenta.findOne({ mesa: mesaId, estado: 'Abierta' });
    if (cuentaAbierta) {
      res.status(400).json({ message: 'La mesa ya tiene una cuenta abierta' });
      return;
    }

    const nuevaCuenta = new Cuenta({ mesa: mesaId, estado: 'Abierta' });
    await nuevaCuenta.save();

    // Actualizar estado de la mesa
    await Mesa.findByIdAndUpdate(mesaId, { estado: 'Ocupada' });

    res.status(201).json(nuevaCuenta);
  } catch (error) {
    res.status(500).json({ message: 'Error al abrir cuenta', error });
  }
};

// 2. Crear un pedido para una cuenta
export const crearPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cuentaId, meseroId, detalles } = req.body;
    
    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta || cuenta.estado === 'Cerrada') {
      res.status(400).json({ message: 'Cuenta no válida o cerrada' });
      return;
    }

    const nuevoPedido = new Pedido({
      cuenta: cuentaId,
      mesero: meseroId,
      detalles,
      estado_general: 'Pendiente'
    });

    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pedido', error });
  }
};

// 3. Obtener pedidos de una cuenta
export const getPedidosPorCuenta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cuentaId } = req.params;
    const pedidos = await Pedido.find({ cuenta: cuentaId }).populate('detalles.producto');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error });
  }
};

// 4. Cobrar la cuenta (Crear Pago y Cerrar Cuenta)
export const cobrarCuenta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cuentaId, monto_total, metodo_pago } = req.body;

    const cuenta = await Cuenta.findById(cuentaId);
    if (!cuenta || cuenta.estado === 'Cerrada') {
      res.status(400).json({ message: 'Cuenta no válida o ya está cerrada' });
      return;
    }

    // Crear el registro de pago
    const nuevoPago = new Pago({
      cuenta: cuentaId,
      monto_total,
      metodo_pago
    });
    await nuevoPago.save();

    // Cerrar cuenta y liberar mesa
    cuenta.estado = 'Cerrada';
    cuenta.fecha_cierre = new Date();
    await cuenta.save();

    await Mesa.findByIdAndUpdate(cuenta.mesa, { estado: 'Disponible' });
    await Pedido.updateMany({ cuenta: cuentaId }, { estado_general: 'Pagado' });

    res.status(200).json({ message: 'Cuenta cobrada exitosamente', pago: nuevoPago });
  } catch (error) {
    res.status(500).json({ message: 'Error al cobrar cuenta', error });
  }
};
