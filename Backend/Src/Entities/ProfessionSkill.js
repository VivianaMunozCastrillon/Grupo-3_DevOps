const { EntitySchema } = require('typeorm');

const ProfessionSkill = new EntitySchema({
    name: 'ProfessionSkill',
    tableName: 'TblProfessionSkills',
    columns: {
        Id: {
            primary: true,
            type: 'int',
            generated: true
        },
        ProfessionId: {
            type: 'int'
        },
        SkillId: {
            type: 'int'
        }
    },
    relations: {
        Profession: {
            target: 'Profession',
            type: 'many-to-one',
            joinColumn: { name: 'ProfessionId' }
        },
        Skill: {
            target: 'Skill',
            type: 'many-to-one',
            joinColumn: { name: 'SkillId' }
        }
    }
});


module.exports = ProfessionSkill;

