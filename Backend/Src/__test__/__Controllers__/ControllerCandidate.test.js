const request = require('supertest');
const express = require('express');
const RegisterCandidate = require('../../Controllers/ControllerCandidate');
const cloudinary = require("../../Utils/Cloudinary");
const { dataSource } = require('../../database');
const Candidate = require('../../Entities/Candidate');

// Configurar un servidor Express para pruebas
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Permitir parsing de formularios
app.post('/register-candidate', RegisterCandidate);

// Mock de cloudinary y la base de datos
jest.mock('../../Utils/Cloudinary');
jest.mock('../../database', () => ({
    dataSource: {
        getRepository: jest.fn().mockReturnValue({
            insert: jest.fn(),
        }),
    },
}));

describe('POST /register-candidate', () => {
    beforeEach(() => {
        cloudinary.uploader.upload_stream.mockClear();
        dataSource.getRepository(Candidate).insert.mockClear();
    });

    it('debería responder con 400 si faltan campos requeridos', async () => {
        const response = await request(app)
            .post('/register-candidate')
            .send({
                data: JSON.stringify({
                    Name: "John Doe",
                    Email: "john@example.com",
                    // Falta CandidatesId y otros campos
                })
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'El contenido no está completo' });
    });

    it('debería responder con 400 si Skill no es un array o está vacío', async () => {
        const response = await request(app)
            .post('/register-candidate')
            .send({
                data: JSON.stringify({
                    CandidatesId: "123",
                    Name: "John Doe",
                    Email: "john@example.com",
                    Phone: "1234567890",
                    ProfessionId: "1",
                    ExperienceYears: 5,
                    EducationLevel: "Bachelor",
                    ApplicationDate: "2023-01-01",
                    City: "New York",
                    Skill: "not-an-array" // Skill no es un array
                })
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Debe proporcionar al menos una habilidad' });
    });
    
    it('debería responder con 200 si el candidato se agrega correctamente', async () => {
        const mockFile = Buffer.from("archivo"); // Simulación de un archivo
        cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
            callback(null, { secure_url: "http://cloudinary.com/resume.pdf" });
        });
        dataSource.getRepository(Candidate).insert.mockResolvedValueOnce({}); // Simulamos que la inserción en la DB es exitosa

        await request(app)
            .post('/register-candidate')
            .field('data', JSON.stringify({
                CandidatesId: "123",
                Name: "John Doe",
                Email: "john@example.com",
                Phone: "1234567890",
                ProfessionId: "1",
                ExperienceYears: 5,
                EducationLevel: "Bachelor",
                ApplicationDate: "2023-01-01",
                City: "New York",
                Skill: ["JavaScript", "Node.js"]
            }))
            .attach('file', mockFile, { filename: "resume.pdf" });

        expect.objectContaining({
            CandidatesId: "123",
            Name: "John Doe",
            Email: "john@example.com",
            Phone: "1234567890",
            ProfessionId: "1",
            ExperienceYears: 5,
            EducationLevel: "Bachelor",
            ApplicationDate: "2023-01-01",
            City: "New York",
            Skill: ["JavaScript", "Node.js"],
            Resume: "http://cloudinary.com/resume.pdf" // URL simulada
        });
    });

    it('debería responder con 500 si hay un error al subir el archivo', async () => {
        const mockFile = Buffer.from("archivo");
        cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
            callback(new Error("Upload failed"), null);
        });

        const response = await request(app)
            .post('/register-candidate')
            .field('data', JSON.stringify({
                CandidatesId: "123",
                Name: "John Doe",
                Email: "john@example.com",
                Phone: "1234567890",
                ProfessionId: "1",
                ExperienceYears: 5,
                EducationLevel: "Bachelor",
                ApplicationDate: "2023-01-01",
                City: "New York",
                Skill: ["JavaScript", "Node.js"]
            }))
            .attach('file', mockFile, { filename: "resume.pdf" });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Error al ingresar el candidato' });
    });
});
