var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var porteSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    }
});

var porte = mongoose.model("porte", porteSchema);

module.exports = porte;