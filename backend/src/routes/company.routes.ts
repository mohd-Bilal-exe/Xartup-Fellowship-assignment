import { Router } from 'express';
import * as CompanyController from '../controllers/company.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Protect company exploration
router.use(authenticate);

router.get('/', CompanyController.getCompanies);
router.get('/:id', CompanyController.getCompanyById);
router.post('/:id/enrich', CompanyController.enrichCompany);
router.post('/:id/notes', CompanyController.addNote);

export default router;
