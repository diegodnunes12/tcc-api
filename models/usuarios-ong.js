var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var usuarioOngSchema = new Schema ({    
    usuario:{
        type: Schema.Types.ObjectId,
        ref: "usuario",
        required:true
    },
    ong:{
        type: Schema.Types.ObjectId,
        ref: "ong",
        required:true
    },
});

var usuarioOng = mongoose.model("usuarioOng", usuarioOngSchema);

module.exports = usuarioOng;