const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderJoin, renderMain, renderSearch } = require('../controllers/page');
const { renderProfile } = require('../controllers/user');
const { getUserStats } = require('../utils/userStats');
const router = express.Router();

router.use(async (req, res, next) => {
    try {
         // 쿠키에서 다크모드 상태 읽기
        res.locals.darkMode = req.cookies.darkMode === 'true' || false; // 템플릿 변수로 전달

        if (req.user) {
            const { questionCount, answerCount } = await getUserStats(req.user.id);
            res.locals.user = req.user;
            res.locals.questionCount = questionCount;
            res.locals.answerCount = answerCount;
        } else {
            res.locals.user = null;
            res.locals.questionCount = 0;
            res.locals.answerCount = 0;
        }
    } catch (err) {
        console.error('Error in router.use middleware:', err);
        next(err);
    }
    next();
});
router.get('/profile', isLoggedIn, renderProfile);
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/search', renderSearch);
router.get('/', renderMain);

module.exports = router;
