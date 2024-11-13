// ControllerProfession.js
const { dataSource } = require('../DataBase');
const Profession = require('../Entities/Profession');

const GetProfessions = async (req, res) => {
    try {
        const professionRepository = dataSource.getRepository(Profession);
        const professions = await professionRepository.find();
        res.status(200).json(professions);
    } catch (error) {
        console.error('Error al recuperar todas las profesiones:', error);
        res.status(500).json({ error: 'Error al recuperar todas las profesiones' });
    }
};

module.exports = GetProfessions; 
 
