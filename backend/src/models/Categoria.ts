import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoria extends Document {
  nombre: string;
  descripcion?: string;
}

const CategoriaSchema: Schema = new Schema(
  {
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICategoria>('Categoria', CategoriaSchema);
