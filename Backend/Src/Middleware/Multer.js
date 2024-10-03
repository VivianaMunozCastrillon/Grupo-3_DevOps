// Importa el módulo 'multer', que es un middleware para manejar la carga de archivos en el servidor
const multer = require('multer');

// Configura 'multer' para utilizar la memoria del servidor para almacenar los archivos temporalmente durante la carga
const upload = multer({ storage: multer.memoryStorage() });

// Exporta el objeto de configuración 'upload' para que pueda ser utilizado en otros archivos del proyecto
module.exports = upload;