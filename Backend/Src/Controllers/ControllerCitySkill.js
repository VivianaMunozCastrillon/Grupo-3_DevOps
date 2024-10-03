const { dataSource } = require('../database');
const Profession = require('../Entities/Profession');

const GetCitiesAndSkillsByProfession = async (req, res) => {
    try {
        const { ProfessionId } = req.params;

        const professionRepo = dataSource.getRepository(Profession);
        const professionEntity = await professionRepo.findOne({
            where: { ProfessionId },
            relations: ['Cities.City', 'Skills.Skill'],
        });

        if (!professionEntity) {
            return res.status(404).json({ error: 'Profesión no encontrada' });
        }

        const cities = professionEntity.Cities.map(cityRelation => cityRelation.City.City);
        const skills = professionEntity.Skills.map(skill => skill.Skill.Name);

        res.status(200).json({ cities, skills });
    } catch (error) {
        console.error('Error al obtener ciudades y habilidades:', error);
        res.status(500).json({ error: 'Error al obtener ciudades y habilidades' });
    }
};

module.exports = GetCitiesAndSkillsByProfession;
