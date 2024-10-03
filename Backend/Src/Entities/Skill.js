const { EntitySchema } = require("typeorm");
//entidad de categoria
const Skill = new EntitySchema({
    name: "Skill",
    tableName: "TblSkills",
    columns: {
        SkillId: {
            primary: true,
            type: "int",
            generated: true
 
        },
        Name:{
            type: "varchar"
        }

        
    },
 
});
//Exportacion de la entidad
module.exports = Skill;