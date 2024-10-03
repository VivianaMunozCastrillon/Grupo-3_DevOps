const { dataSource } = require('../database');
const Candidate = require('../Entities/Candidate');
const CitySkill = require('../Controllers/ControllerCitySkill');
const cloudinary = require("../Utils/Cloudinary");

const RegisterCandidate = async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        const { CandidatesId, Name, Email, Phone, ProfessionId, ExperienceYears, EducationLevel, ApplicationDate, City, Skill } = data;
        const imageFile = req.file;

        // Validar que todos los campos estén presentes
        if (!CandidatesId || !Name || !Email || !Phone || !ProfessionId || !ExperienceYears || !EducationLevel || !ApplicationDate || !City || !Skill) {
            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        let Resume = null;

        // Si se sube un archivo, se procesa y se sube a Cloudinary
        if (imageFile) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream((err, result) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }).end(imageFile.buffer);
            });
            Resume = result.secure_url;
        }

        

        // Crear los datos del candidato
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
