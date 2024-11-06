const { dataSource } = require('../database');
const Candidate = require('../Entities/Candidate');
const cloudinary = require("../Utils/Cloudinary");

const RegisterCandidate = async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        const { CandidatesId, Name, Email, Phone, ProfessionId, ExperienceYears, EducationLevel, ApplicationDate, City, Skill } = data;
        const imageFile = req.file;

        // Validación de los campos
        if (!CandidatesId || !Name || !Email || !Phone || !ProfessionId || !ExperienceYears || !EducationLevel || !ApplicationDate || !City || !Skill) {
            return res.status(400).json({ error: 'El contenido no está completo' });
        }
        if (!Array.isArray(Skill) || Skill.length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar al menos una habilidad' });
        }

        let Resume = null;

        // Subida de la imagen a Cloudinary
        if (imageFile) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                Resume = result.secure_url;
            } catch (error) {
                console.error("Error al subir la imagen a Cloudinary:", error);
                return res.status(500).json({ error: "Error al subir la imagen" });
            }
        }

        // Crear datos del candidato
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
        await candidateRepo.insert(candidateData);

        res.status(200).json({ success: true, msg: 'Candidato agregado' });
    } catch (error) {
        console.error('Error al ingresar el candidato:', error);
        res.status(500).json({ error: 'Error al ingresar el candidato' });
    }
};

module.exports = RegisterCandidate;

