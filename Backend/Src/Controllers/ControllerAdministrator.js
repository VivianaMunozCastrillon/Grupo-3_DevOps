const { dataSource } = require('../database');
const Candidate = require('../Entities/Candidate');
const cloudinary = require("../Utils/Cloudinary");

const GetCandidates = async (req, res) => {
    try {
      const CandidateRepository = dataSource.getRepository(Candidate);
      const Candidates = await CandidateRepository.find();
      res.status(200).json(Candidates);
    } catch (error) {
      console.error('Error al recuperar todos los candidatos:', error);
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
      console.error('Error al eliminar el candidato:', error);
      res.status(500).json({ error: 'Error al eliminar el candidato' });
    }
  };

  
  module.exports ={
    GetCandidates,
    DeleteCandidates
  } ;  

  