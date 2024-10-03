const { EntitySchema } = require("typeorm");

const Admin = new EntitySchema({
    name: "Admin",
    tableName: "TblAdmin",
    columns: {
        AdminId: {
            primary: true,
            type: "int"
        },
        PasswordAdmin:{
            type: "varchar"
        }

        
    },
 
});
//Exportacion de la entidad
module.exports = Admin;