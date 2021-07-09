const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const especieRouter = require('./routes/especies');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/especies', especieRouter);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(() => {
    console.log('conectou ao mongo');
}).catch(error => {
    console.log('Algo aconteceu ao acessar o mongo', error);
})

app.listen(PORT, () => {
    console.log('Server started at PORT ', PORT);
})