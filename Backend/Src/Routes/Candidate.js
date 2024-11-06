const express = require('express');
const router = express.Router();
const upload = require('../Middleware/Multer');
const { GetCandidates, DeleteCandidates } = require('../Controllers/ControllerAdministrator');
const GetProfessions = require('../Controllers/ControllerProfession'); // Asegúrate de que este nombre coincida
const RegisterCandidate = require('../Controllers/ControllerCandidate');
const GetCitiesAndSkillsByProfession = require('../Controllers/ControllerCitySkill');

// Ruta para obtener todas las profesiones
router.get('/AllProfessions', GetProfessions); 
//Obtener Ciudades y Habilidades Por Profesion
router.get('/profession/:ProfessionId', GetCitiesAndSkillsByProfession); 

//Registrar Candidatos
router.post('/candidates', upload.single('resume'), RegisterCandidate);

//Administrar Candidatos
router.get('/AllCandidates', GetCandidates);
router.delete('/DeleteCandidates/:CandidatesId', DeleteCandidates);

module.exports = router;

