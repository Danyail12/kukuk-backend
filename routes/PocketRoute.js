// routes.js
import express from 'express';
import { createPocketGarrage } from '../controllers/PocketGarrageController.js'; // Import your controller
import { isAuthenticated, AuthorizedAdmin } from '../middlewares/auth.js'; // Import your authentication middleware

const router = express.Router();

// Example route for creating a PocketGarrage entry
router.post('/pocketgarrage',isAuthenticated, createPocketGarrage);

export default router;
