import mongoose, { Schema, Document } from 'mongoose';

export interface IMesa extends Document {
  numero: number;
  capacidad: number;
  estado: 'Disponible' | 'Ocupada' | 'Reservada';
}

const MesaSchema: Schema = new Schema(
  {
    numero: { type: Number, required: true, unique: true },
    capacidad: { type: Number, required: true },
    estado: {
      type: String,
      enum: ['Disponible', 'Ocupada', 'Reservada'],
      default: 'Disponible',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMesa>('Mesa', MesaSchema);
