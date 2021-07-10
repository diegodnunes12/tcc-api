var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var tipoUsuarioOngSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    }
});

var tipoUsuarioOng = mongoose.model("tipoUsuarioOng", tipoUsuarioOngSchema);

module.exports = tipoUsuarioOng;