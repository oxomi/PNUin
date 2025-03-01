const db = require(process.cwd() + '/models');

async function getUserStats(userId) {
    try {
        // 질문 수 및 제목 가져오기
        const [questions] = await db.execute(
            'SELECT title FROM posts WHERE userId = ?',
            [userId]
        );
        const questionCount = questions.length;

        // 답변 수 및 제목 가져오기
        const [answers] = await db.execute(
            `SELECT p.title 
             FROM posts p 
             JOIN replies r ON p.id = r.postId 
             WHERE r.userId = ?`,
            [userId]
        );
        const answerCount = answers.length;

        console.log('질문 수:', questionCount, '답변 수:', answerCount); // 결과 확인

        return {
            questionCount,
            answerCount,
            questions: questions.map(q => q.title), // 질문 제목 배열
            answers: answers.map(a => a.title)     // 답변 제목 배열
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
}

module.exports = { getUserStats };
