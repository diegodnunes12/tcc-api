const mongoose = require('mongoose');
const yup = require('yup');
const { ObjectId } = require('mongodb')

const AnimalSchema = new mongoose.Schema({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50
    },
    pelagem: {
        type: String,
        required:false,
        maxlength: 50
    },
    sexo: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 10
    },
    raca: {
        type: String,
        required:false,
        maxlength: 50
    },
    historia: {
        type: String,
        required:false,
        maxlength: 500
    },
    castrado: {
        type: Boolean,
        required:true
    },
    vacinado: {
        type: Boolean,
        required:true
    },
    vermifugado: {
        type: Boolean,
        required:true
    },
    ong_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ong",
        required:true
    },
    especie_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Especie",
        required:true
    },
    porte_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Porte",
        required:true
    },
    data_cadastro: {
        type: Date,
        required:true
    }
});

const validate = animal => {
    const schema = yup.object().shape({
        nome: yup.string().required().min(3, "O nome deve ser maior do que 3 caracteres").max(50, "O nome deve ser menor do que 50 caracteres"),
        pelagem: yup.string().max(50, "A pelagem deve ser menor do que 50 caracteres"),
        sexo: yup.string().required().max(10, "O sexo deve ser menor do que 10 caracteres"),
        raca: yup.string().max(50, "A raça deve ser menor do que 50 caracteres"),
        historia: yup.string().max(500, "A história deve ser menor do que 500 caracteres"),
        castrado: yup.boolean().required(),
        vacinado: yup.boolean().required(),
        vermifugado: yup.boolean().required(),
        data_cadastro: yup.string().required(),
    });

    return schema.validate(animal).then(animal => animal).catch((error) => {
        return {message: error.message}
    });
}

exports.Animal = new mongoose.model('Animal', AnimalSchema);
exports.validate = validate;