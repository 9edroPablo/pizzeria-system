const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
nombre: {type: String, required: true, trim: true},
descripcion: {type: String, required: true, trim: true},
precio: {
    type: Number, 
    required: true, 
    min: [0, "El precio no puede ser negativa"]
},
categoria: {
    type: String,
    required: true,
    enum: {
        values: ["pizzas", "bebidas", "postres", "entradas"],
        message: '{VALUE} no es una categoria valida.'
    },
    lowercase: true
 },
disponible: {type: Boolean, default: true}
},{
    timestamps: true
}); 

const Producto = mongoose.model("Producto", productoSchema);
module.exports = mongoose.model("Producto", productoSchema);