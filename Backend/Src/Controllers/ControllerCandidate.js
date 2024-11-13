
const { dataSource } = require('../DataBase');
const Candidate = require('../Entities/Candidate');
const cloudinary = require("../Utils/Cloudinary");

const RegisterCandidate = async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        const { CandidatesId, Name, Email, Phone, ProfessionId, ExperienceYears, EducationLevel, ApplicationDate, City, Skill } = data;

        const imageFile = req.file; // Acceso al archivo de imagen subido


        if (!CandidatesId || !Name || !Email || !Phone || !ProfessionId || !EducationLevel || !ApplicationDate || !City || !Skill) {
            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        if (!Array.isArray(Skill) || Skill.length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar al menos una habilidad' });
        }

        let Resume = null;

        if (imageFile) {
            try {
                const result = await cloudinary.uploader.upload_stream((error, result) => {
                    if (error) {
                        console.error("Error al subir la imagen a Cloudinary:", error);
                        return res.status(500).json({ error: "Error al subir la imagen" });
                    }
                    Resume = result.secure_url;
                }).end(imageFile.buffer); // Usa el buffer del archivo
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


// Función auxiliar para subir el archivo a Cloudinary
const uploadFileToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto' // Detecta automáticamente el tipo de archivo
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(file.buffer); // Finaliza el upload stream con el buffer del archivo
    });
};

module.exports = RegisterCandidate;

