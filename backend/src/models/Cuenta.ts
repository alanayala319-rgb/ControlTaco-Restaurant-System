import mongoose, { Schema, Document } from 'mongoose';

export interface ICuenta extends Document {
  mesa: mongoose.Types.ObjectId;
  estado: 'Abierta' | 'Cerrada';
  fecha_apertura: Date;
  fecha_cierre?: Date;
}

const CuentaSchema: Schema = new Schema(
  {
    mesa: { type: Schema.Types.ObjectId, ref: 'Mesa', required: true },
    estado: { type: String, enum: ['Abierta', 'Cerrada'], default: 'Abierta' },
    fecha_apertura: { type: Date, default: Date.now },
    fecha_cierre: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ICuenta>('Cuenta', CuentaSchema);
