
const { dataSource } = require('../DataBase');
const Candidate = require('../Entities/Candidate');
const Profession = require('../Entities/Profession');
const cloudinary = require("../Utils/Cloudinary");

const RegisterCandidate = async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        const { CandidatesId, Name, Email, Phone, ProfessionId, ExperienceYears, EducationLevel, ApplicationDate, City, Skill } = data;

        const imageFile = req.file;


        if (!CandidatesId || !Name || !Email || !Phone || !ProfessionId || !EducationLevel || !ApplicationDate || !City || !Skill) {
            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        if (!Array.isArray(Skill) || Skill.length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar al menos una habilidad' });
        }

        let Resume = null;

        if (imageFile) {
            try {

                // Envolver la subida en una promesa
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                    uploadStream.end(imageFile.buffer); // Usa el buffer del archivo
                });
                Resume = result.secure_url;

            } catch (error) {
                console.error("Error al subir la imagen a Cloudinary:", error);
                return res.status(500).json({ error: "Error al subir la imagen" });
            }
        }

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
            Resume,
        };

        const candidateRepo = dataSource.getRepository(Candidate);
        await candidateRepo.insert(candidateData);

        res.status(200).json({ success: true, msg: 'Candidato agregado' });
    } catch (error) {

        res.status(500).json({ error: 'Error al ingresar el candidato' });
    }
};

module.exports = RegisterCandidate;

