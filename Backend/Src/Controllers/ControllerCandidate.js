const { dataSource } = require('../database');
const Candidate = require('../Entities/Candidate');
const cloudinary = require("../Utils/Cloudinary");

const RegisterCandidate = async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        const { CandidatesId, Name, Email, Phone, ProfessionId, ExperienceYears, EducationLevel, ApplicationDate, City, Skill } = data;
        const imageFile = req.file;

        // Validar que todos los campos estén presentes
        if (!CandidatesId || !Name || !Email || !Phone || !ProfessionId || !ExperienceYears || !EducationLevel || !ApplicationDate || !City|| !Skill) {
            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        let Resume = null;

        // Si se sube un archivo, se procesa y se sube a Cloudinary
        if (Resume) {
            try {
                const result = await cloudinary.uploader.upload(imageFile.path); // Usa el método async
                Resume = result.secure_url;
            } catch (err) {
                console.error('Error al subir el archivo a Cloudinary:', err);
                return res.status(500).json({ error: 'Error al subir el archivo' });
            }
        }

        // Crear los datos del candidato con referencias a CityId y SkillId
        const candidateData = {
            CandidatesId,
            Name,
            Email,
            Phone,
            ProfessionId,
            ExperienceYears,
            EducationLevel,
            ApplicationDate,
            City, 
            Skill, 
            Resume
        };

        const candidateRepo = dataSource.getRepository(Candidate);
        
        res.status(200).json({ success: true, msg: 'Candidato agregado' });
    } catch (error) {
        console.error('Error al ingresar el candidato:', error);
        res.status(500).json({ error: 'Error al ingresar el candidato' });
    }
};

module.exports = RegisterCandidate;
