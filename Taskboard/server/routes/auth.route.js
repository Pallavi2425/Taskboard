import express from 'express';
import {
  signup,
  signin,
  signOut
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup); 
router.post('/signin', signin);
router.get('/signout', signOut);

export default router;

// In this file we are routing all three end point related to authentication auth controllers    

// Router aceepted the request depending on the URI of the request .
// With /signup /singnin and /signout we have to send the request prefix . 