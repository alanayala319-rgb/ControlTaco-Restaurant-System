import mongoose, { Schema, Document } from 'mongoose';

export interface IDetallePedido {
  producto: mongoose.Types.ObjectId;
  cantidad: number;
  notas?: string;
  estado: 'Pendiente' | 'Preparacion' | 'Listo' | 'Entregado';
}

export interface IPedido extends Document {
  cuenta: mongoose.Types.ObjectId;
  mesero: mongoose.Types.ObjectId;
  detalles: IDetallePedido[];
  estado_general: 'Pendiente' | 'Preparacion' | 'Listo' | 'Entregado' | 'Pagado';
}

const DetallePedidoSchema = new Schema<IDetallePedido>({
  producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true, min: 1 },
  notas: { type: String },
  estado: {
    type: String,
    enum: ['Pendiente', 'Preparacion', 'Listo', 'Entregado'],
    default: 'Pendiente',
  },
});

const PedidoSchema: Schema = new Schema(
  {
    cuenta: { type: Schema.Types.ObjectId, ref: 'Cuenta', required: true },
    mesero: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    detalles: [DetallePedidoSchema],
    estado_general: {
      type: String,
      enum: ['Pendiente', 'Preparacion', 'Listo', 'Entregado', 'Pagado'],
      default: 'Pendiente',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPedido>('Pedido', PedidoSchema);
