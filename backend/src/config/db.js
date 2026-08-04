import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// Conexión a MongoDB.
//
// - Si hay MONGO_URI configurado (.env o variables del hosting), se conecta ahí.
//   Esa es SIEMPRE la opción usada en producción (MongoDB Atlas).
// - Si NO hay MONGO_URI y estamos en desarrollo, se levanta una base en memoria
//   para poder probar el proyecto sin instalar MongoDB. Los datos se pierden
//   al reiniciar, por eso este modo nunca se usa en producción.
// ---------------------------------------------------------------------------
export const connectDB = async () => {
    const enProduccion = process.env.NODE_ENV === 'production';
    let uri = process.env.MONGO_URI;

    try {
        if (!uri) {
            if (enProduccion) {
                // En producción los datos tienen que persistir: sin URI no arrancamos.
                console.error('Falta la variable MONGO_URI. En producción es obligatoria.');
                process.exit(1);
            }

            // Import dinámico: mongodb-memory-server es una dependencia de desarrollo
            // y no se carga nunca cuando NODE_ENV=production.
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mem = await MongoMemoryServer.create();
            uri = mem.getUri();
            console.log('MongoDB: base en memoria (solo desarrollo, los datos no se guardan)');
        }

        await mongoose.connect(uri);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;
