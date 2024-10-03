const { EntitySchema } = require("typeorm");
//entidad de categoria
const City2 = new EntitySchema({
    name: "City2",
    tableName: "TblCities",
    columns: {
        CityId: {
            primary: true,
            type: "int",
            generated: true
 
        },
        City:{
            type: "varchar"
        }

        
    },
 
});
//Exportacion de la entidad
module.exports = City2;