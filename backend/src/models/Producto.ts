import mongoose, { Schema, Document } from 'mongoose';

export interface IProducto extends Document {
  nombre: string;
  precio: number;
  categoria: mongoose.Types.ObjectId;
  ingredientes: string[]; // Referencias al nombre en inventario o simplemente textos descriptivos
  disponible: boolean;
}

const ProductoSchema: Schema = new Schema(
  {
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    ingredientes: [{ type: String }],
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProducto>('Producto', ProductoSchema);
