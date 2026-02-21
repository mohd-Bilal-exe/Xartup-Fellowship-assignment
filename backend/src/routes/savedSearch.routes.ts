import { Router } from 'express';
import * as SavedSearchController from '../controllers/savedSearch.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All saved search routes require authentication
router.use(authenticate);

router.get('/', SavedSearchController.getSavedSearches);
router.post('/', SavedSearchController.createSavedSearch);
router.delete('/:id', SavedSearchController.deleteSavedSearch);

export default router;
