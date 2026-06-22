import { Request, Response } from 'express';
import Mesa from '../models/Mesa';
import { hasDatabaseConnection } from '../config/db';

interface DemoMesa {
  _id: string;
  numero: number;
  capacidad: number;
  estado: 'Disponible' | 'Ocupada' | 'Reservada';
}

const demoMesas: DemoMesa[] = [
  { _id: 'demo-1', numero: 1, capacidad: 4, estado: 'Disponible' },
  { _id: 'demo-2', numero: 2, capacidad: 2, estado: 'Ocupada' },
  { _id: 'demo-3', numero: 3, capacidad: 6, estado: 'Reservada' },
  { _id: 'demo-4', numero: 4, capacidad: 4, estado: 'Disponible' },
  { _id: 'demo-5', numero: 5, capacidad: 8, estado: 'Disponible' },
];

export const getMesas = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!hasDatabaseConnection()) {
      res.json(demoMesas);
      return;
    }

    const mesas = await Mesa.find();
    res.json(mesas.length > 0 ? mesas : demoMesas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mesas', error });
  }
};

export const createMesa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { numero, capacidad } = req.body;

    if (!hasDatabaseConnection()) {
      const nuevaMesa: DemoMesa = {
        _id: `demo-${Date.now()}`,
        numero,
        capacidad,
        estado: 'Disponible',
      };
      demoMesas.push(nuevaMesa);
      res.status(201).json(nuevaMesa);
      return;
    }

    const nuevaMesa = new Mesa({ numero, capacidad });
    await nuevaMesa.save();
    res.status(201).json(nuevaMesa);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear mesa', error });
  }
};

export const updateMesaStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!hasDatabaseConnection()) {
      const mesa = demoMesas.find((item) => item._id === id);
      if (!mesa) {
        res.status(404).json({ message: 'Mesa no encontrada' });
        return;
      }

      mesa.estado = estado;
      res.json(mesa);
      return;
    }

    const mesaActualizada = await Mesa.findByIdAndUpdate(id, { estado }, { new: true });
    if (!mesaActualizada) {
      res.status(404).json({ message: 'Mesa no encontrada' });
      return;
    }
    res.json(mesaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar mesa', error });
  }
};
