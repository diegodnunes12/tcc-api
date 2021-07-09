const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const app = express();
require('dotenv').config();
const especieRouter = require('./routes/especies');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

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

app.use('/api/especies', especieRouter);

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