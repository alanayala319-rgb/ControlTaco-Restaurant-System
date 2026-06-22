import mongoose, { Schema, Document } from 'mongoose';

export interface IPago extends Document {
  cuenta: mongoose.Types.ObjectId;
  monto_total: number;
  metodo_pago: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Mixto';
  fecha: Date;
}

const PagoSchema: Schema = new Schema(
  {
    cuenta: { type: Schema.Types.ObjectId, ref: 'Cuenta', required: true },
    monto_total: { type: Number, required: true },
    metodo_pago: {
      type: String,
      enum: ['Efectivo', 'Tarjeta', 'Transferencia', 'Mixto'],
      required: true,
    },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IPago>('Pago', PagoSchema);
