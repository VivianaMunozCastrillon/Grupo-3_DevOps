const { GetCandidates, DeleteCandidates } = require('../../Controllers/ControllerAdministrator');
const { dataSource } = require('../../database');
const Candidate = require('../../Entities/Candidate');
const cloudinary = require('../../Utils/Cloudinary');

jest.mock('../../database');
jest.mock('../../Utils/Cloudinary');

describe('Admin Controller Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GetCandidates', () => {
    

    it('should handle errors when retrieving candidates', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({
        find: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await GetCandidates(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al recuperar todos los candidatos' });
    });
  });

  describe('DeleteCandidates', () => {
    it('should delete a candidate and its associated image in Cloudinary', async () => {
      const mockCandidate = {
        CandidatesId: '123',
        Resume: 'http://res.cloudinary.com/demo/image/upload/sample.jpg',
      };

      dataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockCandidate),
        delete: jest.fn().mockResolvedValue({})
      });

      cloudinary.uploader.destroy = jest.fn((public_id, callback) => callback(null, { result: 'ok' }));

      const req = { params: { CandidatesId: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await DeleteCandidates(req, res);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('sample', expect.any(Function));
      expect(res.json).toHaveBeenCalledWith({ msg: 'Candidato eliminado correctamente' });
    });

    it('should return 404 if candidate is not found', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

      const req = { params: { CandidatesId: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await DeleteCandidates(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Candidato no encontrado' });
    });

    it('should handle errors when deleting a candidate', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      const req = { params: { CandidatesId: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await DeleteCandidates(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al eliminar el candidato' });
    });
  });
});

