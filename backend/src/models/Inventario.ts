import mongoose, { Schema, Document } from 'mongoose';

export interface IInventario extends Document {
  item_nombre: string;
  cantidad_actual: number;
  stock_minimo: number;
  proveedor?: string;
}

const InventarioSchema: Schema = new Schema(
  {
    item_nombre: { type: String, required: true, unique: true },
    cantidad_actual: { type: Number, required: true, default: 0 },
    stock_minimo: { type: Number, required: true, default: 10 },
    proveedor: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IInventario>('Inventario', InventarioSchema);
