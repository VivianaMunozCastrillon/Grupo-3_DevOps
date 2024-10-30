const request = require('supertest'); // Para realizar solicitudes HTTP en pruebas
const express = require('express'); // Para crear la aplicación de Express
const { dataSource } = require('../../database'); // Conexión a la base de datos
const { GetCandidates, DeleteCandidates } = require('../../Controllers/ControllerAdministrator'); // Controladores para las operaciones de candidatos
const cloudinary = require("../../Utils/Cloudinary"); // Utilidad para gestionar imágenes en Cloudinary

const app = express();
app.use(express.json()); // Middleware para manejar solicitudes JSON

// Mocks de dependencias
jest.mock('../../database', () => ({
    dataSource: {
        getRepository: jest.fn(), // Mock para el repositorio de la base de datos
    },
}));

jest.mock("../../Utils/Cloudinary", () => ({
    uploader: {
        destroy: jest.fn(), // Mock de la función de eliminación en Cloudinary
    },
}));

describe('Candidate API', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpiar mocks después de cada prueba
    });

    // Pruebas para la ruta GET /candidates
    describe('GET /candidates', () => {
        it('should return a list of candidates with skills', async () => {
            const mockCandidates = [ /* Datos simulados de candidatos */ ];
            dataSource.getRepository.mockReturnValue({
                find: jest.fn().mockResolvedValue(mockCandidates), // Simular la respuesta de búsqueda de candidatos
            });

            const response = await request(app).get('/candidates'); // Realiza una solicitud GET

            expect(response.status).toBe(200); // Verifica que el estado de la respuesta sea 200
            expect(response.body).toEqual(mockCandidates); // Verifica que el cuerpo de la respuesta sea igual a los candidatos simulados
        });

        it('should return a 500 error if there is a database error', async () => {
            dataSource.getRepository.mockReturnValue({
                find: jest.fn().mockRejectedValue(new Error('Database error')), // Simular un error en la base de datos
            });

            const response = await request(app).get('/candidates'); // Realiza una solicitud GET

            expect(response.status).toBe(500); // Verifica que el estado de la respuesta sea 500
            expect(response.body).toEqual({ error: 'Error al recuperar todos los candidatos' }); // Verifica el mensaje de error
        });
    });

    // Pruebas para la ruta DELETE /candidates/:CandidatesId
    describe('DELETE /candidates/:CandidatesId', () => {
        it('should delete a candidate and its resume from Cloudinary', async () => {
            const mockCandidate = { /* Datos simulados del candidato */ };
            dataSource.getRepository.mockReturnValue({
                findOne: jest.fn().mockResolvedValue(mockCandidate), // Simular búsqueda del candidato
                delete: jest.fn().mockResolvedValue({}), // Simular eliminación exitosa
            });

            cloudinary.uploader.destroy.mockImplementation((public_id, callback) => {
                callback(null, {}); // Simular respuesta de eliminación en Cloudinary
            });

            const response = await request(app).delete('/candidates/1'); // Realiza una solicitud DELETE

            expect(response.status).toBe(200); // Verifica que el estado de la respuesta sea 200
            expect(response.body).toEqual({ msg: "Candidato eliminado correctamente" }); // Verifica el mensaje de éxito
        });

        it('should return a 400 error if no CandidatesId is provided', async () => {
            const response = await request(app).delete('/candidates/'); // Realiza una solicitud DELETE sin ID

            expect(response.status).toBe(400); // Verifica que el estado de la respuesta sea 400
            expect(response.body).toEqual({ error: 'ID del candidato no proporcionado' }); // Verifica el mensaje de error
        });

        it('should return a 404 error if the candidate is not found', async () => {
            dataSource.getRepository.mockReturnValue({
                findOne: jest.fn().mockResolvedValue(null), // Simular que no se encuentra el candidato
            });

            const response = await request(app).delete('/candidates/1'); // Realiza una solicitud DELETE

            expect(response.status).toBe(404); // Verifica que el estado de la respuesta sea 404
            expect(response.body).toEqual({ error: 'Candidato no encontrado' }); // Verifica el mensaje de error
        });

        it('should return a 500 error if there is a server error during deletion', async () => {
            dataSource.getRepository.mockReturnValue({
                findOne: jest.fn().mockResolvedValue(mockCandidate), // Simular búsqueda exitosa
                delete: jest.fn().mockRejectedValue(new Error('Delete error')), // Simular error en la eliminación
            });

            const response = await request(app).delete('/candidates/1'); // Realiza una solicitud DELETE

            expect(response.status).toBe(500); // Verifica que el estado de la respuesta sea 500
            expect(response.body).toEqual({ error: 'Error al eliminar el candidato' }); // Verifica el mensaje de error
        });
    });
});



// Nota: Veo algunos endpoint que devuelven respuestas quizas equivocadas, ajustar los test
// basados en las necesidades y los codigos de su preferencia 404, 400 etc... 
// esto es una sugerencia ya que es importante en ambientes controlados guiarse con respecto al # de codigo
// que se devuelve para ver que error hay y como solucionarlo