const express = require('express');
const morgan = require('morgan');

const { connection } = require('./database');


const app = express(); //Creo un objeto para usar las funcionalidades de Express

// //Inicializacion de coneccion a la DB

connection();


//middlewares
app.use(morgan('dev')); //Muestra las peticiones que llegan
app.use(express.json()) //Traducción de peticiones JSON para entendimiento del backend.

//Configuración del puerto

app.set('port', process.env.portbackend || 4000); //Opción con variable de entorno, sino por defecto puerto 3000


app.listen(process.env.portbackend || 4000, () => {
    console.log('servidor en el puerto', app.get('port'));
});

//Rutas
app.use('/Candidate',require('./Routes/Candidate'));
app.use('/',require('./Routes/WhoWeAre'));
app.use('/Api',require('./Routes/Login'));



