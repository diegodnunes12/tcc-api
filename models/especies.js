const mongoose = require('mongoose');
const yup = require('yup');

const EspecieSchema = new mongoose.Schema({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50
    }
});

const validate = especie => {
    const schema = yup.object().shape({
        nome: yup.string().required().min(3, "O nome deve ser maior do que 3 caracteres").max(50, "O nome deve ser menor do que 50 caracteres")
    });

    return schema.validate(especie).then(especie => especie).catch((error) => {
        return {message: error.message}
    });
}



exports.Especie = new mongoose.model('Especie', EspecieSchema);
exports.validate = validate;