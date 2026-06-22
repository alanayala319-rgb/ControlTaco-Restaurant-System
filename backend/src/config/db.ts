import mongoose from 'mongoose';

export const hasDatabaseConnection = () => mongoose.connection.readyState === 1;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('MONGO_URI no configurado. ControlTaco iniciara en modo demo sin base de datos.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`No se pudo conectar a MongoDB. ControlTaco continuara en modo demo: ${error}`);
  }
};
