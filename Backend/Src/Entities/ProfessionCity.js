const { EntitySchema } = require('typeorm');

const ProfessionCity = new EntitySchema({
    name: 'ProfessionCity',
    tableName: 'TblProfessionCities',
    columns: {
        Id: {
            primary: true,
            type: 'int',
            generated: true
        }
    },
    relations: {
        Profession: {
            target: 'Profession',
            type: 'many-to-one',
            joinColumn: { name: 'ProfessionId' }
        },
        City: {
            target: 'City2',
            type: 'many-to-one',
            joinColumn: { name: 'CityId' }
        }
    }
});

module.exports = ProfessionCity;

