import { Router } from 'express';
import { listar, cadastrar } from '../controllers/tarefas.controller.js';

const router = Router();

router.get('/', listar);
router.post('/', cadastrar);

export default router;