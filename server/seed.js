require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Product');
const menu = require('./data/menuReal');

const limpiar = process.argv.includes('--limpiar');

// 1) Seguridad: no correr con datos sin completar
const incompletos = menu.filter(
  (p) => JSON.stringify(p).includes('PENDIENTE') || !(Number(p.precio) > 0)
);
if (menu.length === 0 || incompletos.length > 0) {
  console.error(
    `❌ Seed cancelado: faltan datos en data/menuReal.js (${incompletos.length} producto(s) con PENDIENTE o precio 0).`
  );
  console.error('   Completar los datos correspondientes. No se ejecuto en la base de datos.');
  process.exit(1);
}

// Aviso (no bloquea): productos sin imagen
const sinImagen = menu.filter((p) => !p.imagen_url);
if (sinImagen.length > 0) {
  console.warn(
    `⚠️  ${sinImagen.length} producto(s) sin imagen_url. Se guardarán vacíos; cuando tengas las rutas, llénalas en data/menuReal.js y vuelve a correr el seed.`
  );
}

const ejecutar = async () => {
  try {
    // 2) Validar TODO antes de tocar la base: si uno está mal, no se escribe nada
    for (const producto of menu) {
      await new Producto(producto).validate();
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Conectado a: ${mongoose.connection.name}`);

    // 3) Upsert por nombre
    for (const producto of menu) {
      await Producto.findOneAndUpdate(
        { nombre: producto.nombre },
        { $set: producto },
        { upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
    }

    if (limpiar) {
      const resultado = await Producto.deleteMany({
        nombre: { $nin: menu.map((p) => p.nombre) },
      });
      console.log(`🧹 Productos eliminados que no estaban en el menú real: ${resultado.deletedCount}`);
    }

    const total = await Producto.countDocuments();
    console.log(`✅ Seed listo: ${menu.length} productos del menú real aplicados (total en la colección: ${total})`);
  } catch (error) {
    console.error('❌ Error en el seed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

ejecutar();