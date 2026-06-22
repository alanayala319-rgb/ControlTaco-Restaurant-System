import { Request, Response } from 'express';
import Producto from '../models/Producto';

export const getProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const productos = await Producto.find().populate('categoria');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

export const createProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, precio, categoria, ingredientes, disponible } = req.body;
    const nuevoProducto = new Producto({ nombre, precio, categoria, ingredientes, disponible });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error });
  }
};
