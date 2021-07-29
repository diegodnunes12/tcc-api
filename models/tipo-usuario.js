var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var tipoUsuarioSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    }
});

var tipoUsuario = mongoose.model("tipoUsuario", tipoUsuarioSchema);

module.exports = tipoUsuario;