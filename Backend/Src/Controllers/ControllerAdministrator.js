const { dataSource } = require('../DataBase');
const Candidate = require('../Entities/Candidate');
const Profession = require('../Entities/Profession');
const cloudinary = require("../Utils/Cloudinary");

const GetCandidates = async (req, res) => {
  try {
    const CandidateRepository = dataSource.getRepository(Candidate);
    const Candidates = await CandidateRepository.find({
      relations: ['profession'], // Incluye la relación con Profession
    });

    // Transformar el resultado para devolver el nombre de la profesión al mismo nivel
    const transformedCandidates = Candidates.map(candidate => {
      return {
        CandidatesId: candidate.CandidatesId,
        Name: candidate.Name,
        Email: candidate.Email,
        Phone: candidate.Phone,
        ExperienceYears: candidate.ExperienceYears,
        EducationLevel: candidate.EducationLevel,
        ApplicationDate: candidate.ApplicationDate,
        City: candidate.City,
        Skill: candidate.Skill.map(skill => ({ name: skill })), // Si tienes la relación de habilidades
        Resume: candidate.Resume,
        profession: candidate.profession ? candidate.profession.Name : null // Devuelve el nombre directamente
      };
    });

    res.status(200).json(transformedCandidates);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar todos los candidatos' });
  }
};


  const DeleteCandidates = async (req, res) => {
    try {
      const { CandidatesId } = req.params;
      if (!CandidatesId) {
        return res.status(400).json({ error: 'ID del candidato no proporcionado' });
      }
  
      const repository = dataSource.getRepository(Candidate);
  
     
      const Candidates = await repository.findOne({ where: { CandidatesId } });
      if (!Candidates) {
        return res.status(404).json({ error: 'Candidato no encontrado' });
      }
  
      // Elimina la imagen de Cloudinary si existe una URL de la foto
      if (Candidates.Resume) {
        const public_id = Candidates.Resume.split('/').pop().split('.')[0]; // Obtener el public_id de la URL
        await new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(public_id, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      }
  
      
  
      
      await repository.delete({ CandidatesId });
  
      res.json({ msg: "Candidato eliminado correctamente" });
    } catch (error) {

      res.status(500).json({ error: 'Error al eliminar el candidato' });
    }
  };

  
  module.exports ={
    GetCandidates,
    DeleteCandidates
  } ;  

  