import { Router } from 'express';
import * as ListController from '../controllers/list.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All list routes require authentication
router.use(authenticate);

router.get('/', ListController.getLists);
router.post('/', ListController.createList);
router.post('/add', ListController.addToList);
router.post('/remove', ListController.removeFromList);
router.delete('/:id', ListController.deleteList);

export default router;
