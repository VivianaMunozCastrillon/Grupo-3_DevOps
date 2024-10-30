
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

        // Validar que todos los campos requeridos estén presentes
        if (!CandidatesId || !Name || !Email || !Phone || !ProfessionId || !ExperienceYears || !EducationLevel || !ApplicationDate || !City || !Skill) {
            return res.status(400).json({ error: 'El contenido no está completo' });
        }



        // Validar que Skill sea un array
        if (!Array.isArray(Skill) || Skill.length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar al menos una habilidad' });
        }

        let Resume = null;

        // Subir el archivo (PDF o DOCX) a Cloudinary, si existe
        if (file) {
            try {
                const uploadResult = await uploadFileToCloudinary(file);
                Resume = uploadResult.secure_url; // Guardar la URL del archivo subido
            } catch (err) {
                console.error('Error al subir el archivo a Cloudinary:', err);
                return res.status(500).json({ error: 'Error al ingresar el candidato' });
            }
        }

        // Crear los datos del candidato con la URL del CV
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
