const express = require('express');
const morgan = require('morgan');
// const { connection } = require('./DataBase');

const app = express(); //Creo un objeto para usar las funcionalidades de Express

// //Inicializacion de coneccion a la DB
// connection();

//middlewares
app.use(morgan('dev')); //Muestra las peticiones que llegan
app.use(express.json()) //Traducción de peticiones JSON para entendimiento del backend.

//Configuración del puerto
app.set('port', process.env.portbackend || 3000); //Opción con variable de entorno, sino por defecto puerto 3000

//Rutas
// app.use('/login', require('./routes/authentication'));
// app.use('/news', require('./routes/news'));
// app.use('/category', require('./routes/category'));

//inicializacion del servidor, función en la cual se ejecuta un callback cuando se termine de levantar el servidor. 
//Primer parámetro
//Segundo parametro el servidor
//Callback como medida de comprobacion
app.listen(process.env.portbackend || 3000, () => {
    console.log('servidor en el puerto', app.get('port'));
});

//Rutas
app.use('/QuienesSomos',require('./Routes/QuienesSomos'));
app.use('/Postularse',require('./Routes/Postularse'));
