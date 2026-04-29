import { Router } from 'express';
import { 
    createReservation, 
    getMyReservations, 
    getAllReservations, 
    updateReservationStatus 
} from '../controllers/reservationsController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authenticateToken, createReservation);
router.get('/my', authenticateToken, getMyReservations);
router.get('/user/:userId', authenticateToken, getMyReservations);
router.get('/', authenticateToken, isAdmin, getAllReservations);
router.put('/:id/confirm', authenticateToken, isAdmin, updateReservationStatus);
router.put('/:id/reject', authenticateToken, isAdmin, updateReservationStatus);

export default router;
