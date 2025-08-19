import { Router } from 'express';
import passport from '../config/passport.js';
import { login, signup, me, requestPasswordReset, resetPassword, sendEmailVerification, verifyEmail } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.post('/login', login);
router.post('/signup', signup);
router.get('/me', requireAuth, me);
router.post('/password/request-reset', requestPasswordReset);
router.post('/password/reset', resetPassword);
router.post('/email/send-verify', sendEmailVerification);
router.post('/email/verify', verifyEmail);
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req,res) => {
	// issue JWT for session user
	res.redirect('/');
});
export default router;
