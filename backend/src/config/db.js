import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Conexión a MongoDB.
// Si hay un MONGO_URI configurado (en .env), se conecta a esa base.
// Si NO hay nada configurado, levanta una base en memoria automáticamente,
// así el proyecto corre en cualquier computadora sin tener que instalar MongoDB.
export const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;

        if (!uri) {
            const mem = await MongoMemoryServer.create();
            uri = mem.getUri();
            console.log('Levantando base de datos en memoria (no hace falta instalar MongoDB)');
        }

        await mongoose.connect(uri);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;
