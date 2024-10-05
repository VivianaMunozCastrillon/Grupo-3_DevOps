const typeorm = require("typeorm");
const Candidate = require('./Entities/Candidate');
const  City2 = require('./Entities/City');
const  Profession = require('./Entities/Profession');
const  Skill = require('./Entities/Skill');
const  ProfessionCity = require('./Entities/ProfessionCity');
const  ProfessionSkill = require('./Entities/ProfessionSkill');
const  Admin = require('./Entities/Admin');
const dotenv = require('dotenv');

dotenv.config();

//Instancia de DataSource de typeorm con la configuración  para conectarse a una base de datos MySQL.
const dataSource = new typeorm.DataSource({
    type: "mysql",
    host: process.env.host,
    port: process.env.portdb,
    username: process.env.usernamedb,
    password: process.env.password,
    database: process.env.database,
    synchronize: false,
    entities: [Candidate, City2, Profession, Skill, ProfessionCity, ProfessionSkill, Admin],
});

//Funcion de conexion a la base de datos
async function connection() {
    try { ////Si o si espera que se conecte a la base de datos, sin esto, se dispara el mensaje primero
        await dataSource.initialize(); 
        console.log('Se ha conectado la base de datos');
    } catch (error) {
        console.log('Ha ocurrido un error ' + error);
    }
}

//Exportacion de los modulos para cualquier archivo JavaScript
module.exports = { connection, dataSource };