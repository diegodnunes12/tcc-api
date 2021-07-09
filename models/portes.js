const mongoose = require('mongoose');
const yup = require('yup');

const PorteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50
    }
});

const validate = porte => {
    const schema = yup.object().shape({
        nome: yup.string().required().min(3, "O nome deve ser maior do que 3 caracteres").max(50, "O nome deve ser menor do que 50 caracteres")
    });

    return schema.validate(porte).then(porte => porte).catch((error) => {
        return {message: error.message}
    });
}



exports.Porte = new mongoose.model('Porte', PorteSchema);
exports.validate = validate;