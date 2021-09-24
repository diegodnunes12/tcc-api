var mongoose = require("mongoose");
const { boolean } = require("yup/lib/locale");

const Schema = mongoose.Schema;

var campanhasSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    descricao: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 500,
        trim: true
    },
    valor: {
        type: Number,
        required:true,
    }, 
    chave_pix: {
        type: String,
        required:true,
        maxlength: 50,
    },
    ativo: {
        type: boolean,
        required: true
    },
    ong:{
        type: Schema.Types.ObjectId,
        ref: "ong",
        required:true
    }
});

var campanhas = mongoose.model("campanhas", campanhasSchema);

module.exports = campanhas;