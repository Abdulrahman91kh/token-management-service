import express from "express";
const router = express.Router();
import tokensRoutes from './tokens';

router.use('/', tokensRoutes);

export default router;