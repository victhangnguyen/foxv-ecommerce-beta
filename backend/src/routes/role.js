import express from 'express';
import * as roleController from '../controllers/role.js';

const router = express.Router();

router.get('/roles', roleController.getRoles);

export default router;
