const db = require(process.cwd() + '/models');
const { getUserStats } = require('../utils/userStats.js');

exports.renderProfile = async (req, res, next) => {
    try {
        const stats = await getUserStats(req.user.id);
        res.render('profile', {
            title: '내 정보 - NodeBird',
            questionCount: stats.questionCount,
            answerCount: stats.answerCount,
            questions: stats.questions, // 질문 제목 배열
            answers: stats.answers,    // 답변 제목 배열
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};


exports.getQuestionAndAnswerCount = async (req, res, next) => {
    try {
        const stats = await getUserStats(req.params.id);
        res.json(stats);
    } catch (err) {
        console.error(err);
        next(err);
    }
};