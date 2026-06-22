import { Router } from 'express';
import { abrirCuenta, crearPedido, getPedidosPorCuenta, cobrarCuenta } from '../controllers/pedidoController';

const router = Router();

router.post('/cuenta', abrirCuenta);
router.post('/', crearPedido);
router.get('/cuenta/:cuentaId', getPedidosPorCuenta);
router.post('/cobrar', cobrarCuenta);

export default router;
