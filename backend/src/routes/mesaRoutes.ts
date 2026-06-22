import { Router } from 'express';
import { getMesas, createMesa, updateMesaStatus } from '../controllers/mesaController';

const router = Router();

router.get('/', getMesas);
router.post('/', createMesa);
router.patch('/:id/estado', updateMesaStatus);

export default router;
