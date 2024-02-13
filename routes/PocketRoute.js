// routes.js
import express from 'express';
import { createPocketGarrage,deletePocketGarrage,updatePocketGarrage,getPocketGarrage } from '../controllers/PocketGarrageController.js'; // Import your controller
import { isAuthenticated, AuthorizedAdmin } from '../middlewares/auth.js'; // Import your authentication middleware

const router = express.Router();

// Example route for creating a PocketGarrage entry
router.post('/pocketgarrage',isAuthenticated, createPocketGarrage);
router.delete('/deletePocketGarrage/:id',isAuthenticated, deletePocketGarrage);
router.put('/updatePocketGarrage/:id', isAuthenticated, updatePocketGarrage);
router.get('/getpocketgarrage',isAuthenticated, getPocketGarrage);

export default router;
