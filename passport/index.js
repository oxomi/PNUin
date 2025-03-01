const passport = require('passport');
const local = require('./localStrategy');
const { getUserStats } = require('../utils/userStats');
const db = require(process.cwd() + '/models');

// Passport 초기화: 유저 정보를 세션에 저장
module.exports = () => {
    // 유저 객체를 세션에 저장할 때 ID만 저장
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션에 유저 ID 저장
    });

    // 세션에서 ID를 가져와 유저 객체 복구
    passport.deserializeUser(async (id, done) => {
        try {
            // 데이터베이스에서 유저 정보 가져오기
            const [userRows] = await db.execute('SELECT id, nick FROM users WHERE id = ?', [id]);
            if (userRows.length > 0) {
                const user = userRows[0];
                // 유저의 질문 및 답변 개수 통계 가져오기
                const stats = await getUserStats(user.id);
                user.questionCount = stats.questionCount;
                user.answerCount = stats.answerCount;
                done(null, user); // 유저 객체 복구 완료
            } else {
                done(null, false); // 유저가 없으면 false 반환
            }
        } catch (err) {
            console.error('Error in deserializeUser:', err);
            done(err); // 에러 발생 시 에러 전달
        }
    });

    // Local 전략 등록
    local(); // 로컬 인증 전략 초기화
};
