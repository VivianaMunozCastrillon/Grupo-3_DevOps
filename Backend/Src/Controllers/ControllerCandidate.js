
const { dataSource } = require('../database');
const Candidate = require('../Entities/Candidate');
const cloudinary = require("../Utils/Cloudinary");

const RegisterCandidate = async (req, res) => {
    try {

        // Parsear los datos del cuerpo de la solicitud
        const data = JSON.parse(req.body.data);
        const { 
            CandidatesId, 
            Name, 
            Email, 
            Phone, 
            ProfessionId, 
            ExperienceYears, 
            EducationLevel, 
            ApplicationDate, 
            City, 
            Skill 
        } = data;

        // Obtener el archivo subido
        const file = req.file; 



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
            Resume,
        };

        // Guardar el candidato en la base de datos
        const candidateRepo = dataSource.getRepository(Candidate);
        await candidateRepo.insert(candidateData);

        // Responder con éxito
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

