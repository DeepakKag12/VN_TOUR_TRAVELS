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
// Debug: list users (non-production only)
if(process.env.NODE_ENV !== 'production') {
	router.get('/debug/users', async (req,res)=>{
		try {
			const list = await (await import('../models/User.js')).User.find({}, { username:1, email:1, role:1, id:1 }).limit(50);
			res.json({ users: list });
		} catch(e){ res.status(500).json({ error:'debug_error', message:e.message }); }
	});
}
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req,res) => {
	// issue JWT for session user
	res.redirect('/');
});
export default router;
