const { EntitySchema } = require('typeorm');

const Profession = new EntitySchema({
    name: 'Profession',
    tableName: 'TblProfessions',
    columns: {
        ProfessionId: {
            primary: true,
            type: 'int',
            generated: true
        },
        Name: {
            type: 'varchar',
            length: 100,
            nullable: false
        }
    },
    relations: {
        Cities: {
            target: 'ProfessionCity',
            type: 'one-to-many',
            inverseSide: 'Profession',
            joinColumn: { name: 'ProfessionId' }
        },
        Skills: {
            target: 'ProfessionSkill',
            type: 'one-to-many',
            inverseSide: 'Profession',
            joinColumn: { name: 'ProfessionId' }
        }
    }
});

module.exports = Profession;
