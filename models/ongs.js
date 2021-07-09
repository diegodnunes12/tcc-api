const mongoose = require('mongoose');
const yup = require('yup');

const OngSchema = new mongoose.Schema({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50
    },
    cnpj: {
        type: String,
        required:true,
        maxlength: 20
    },
    telefone: {
        type: String,
        required:true,
        maxlength: 20
    },
    email: {
        type: String,
        required:true,
        maxlength: 50
    },
    facebook: {
        type: String,
        required:false,
        maxlength: 50
    },
    instagram: {
        type: String,
        required:false,
        maxlength: 50
    },
    endereco: {
        type: String,
        required:true,
        maxlength: 100
    },
    data_cadastro: {
        type: Date,
        required:true
    },
});

const validate = ong => {
    const schema = yup.object().shape({
        nome: yup.string().required().min(3, "O nome deve ser maior do que 3 caracteres").max(50, "O nome deve ser menor do que 50 caracteres"),
        cnpj: yup.string().required().max(20, "O CNPJ deve ser menor do que 20 caracteres"),
        telefone: yup.string().required().max(20, "O telefone deve ser menor do que 20 caracteres"),
        email: yup.string().required().max(50, "O telefone deve ser menor do que 50 caracteres"),
        facebook: yup.string().max(50, "O facebook deve ser menor do que 50 caracteres"),
        instagram: yup.string().max(50, "O instagram deve ser menor do que 50 caracteres"),
        endereco: yup.string().required().max(100, "O endereço deve ser menor do que 100 caracteres"),
        data_cadastro: yup.string().required(),
    });

    return schema.validate(ong).then(ong => ong).catch((error) => {
        return {message: error.message}
    });
}



exports.Ong = new mongoose.model('Ong', OngSchema);
exports.validate = validate;