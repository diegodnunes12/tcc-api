const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();
require('dotenv').config();
const routers = require('./routes/routers');
var cors = require('cors');

app.use(cors());

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
			title: "Adote Já API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
        servers: [
			{
				url: "https://adotejaapi.herokuapp.com",
			},
		],
    },
    apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(options);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/files', express.static('uploads'));

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({all: true})
            )
        }),
        new winston.transports.File({filename: 'error.log', level: 'error'})
    ],
    exceptionHandlers: [
        new winston.transports.File({filename: 'path/to/exceptions.log'})
    ]
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(routers.portes);
app.use(routers.animais);
app.use(routers.especies);
app.use(routers.ongs);
app.use(routers.usuarios);
app.use(routers.tipoUsuarioOng);
app.use(routers.usuarioOng);
app.use(routers.contatos);
app.use(routers.mensagens);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(() => {
    logger.info("Connectou com mongo")
}).catch(error => {
    logger.error(error.message)
})

app.listen(PORT, () => {
    logger.info(`Concectou na porta ${PORT}`);
})