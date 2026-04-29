import { Router } from 'express';
import {
  getCircuits,
  getCircuitById,
  getFeaturedCircuits,
  getZones,
  getTypes,
  createCircuit,
  updateCircuit,
  deleteCircuit
} from '../controllers/circuitsController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/featured', getFeaturedCircuits);
router.get('/zones',    getZones);
router.get('/types',    getTypes);
router.get('/',         getCircuits);
router.get('/:id',      getCircuitById);

router.post('/', authenticateToken, isAdmin, createCircuit);
router.put('/:id', authenticateToken, isAdmin, updateCircuit);
router.delete('/:id', authenticateToken, isAdmin, deleteCircuit);

export default router;
