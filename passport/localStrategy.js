const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require(process.cwd() + '/models');

// Local 전략 설정: 이메일과 비밀번호를 기반으로 유저 인증
module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // 로그인 폼에서 이메일 필드명
        passwordField: 'password', // 로그인 폼에서 비밀번호 필드명
        passReqToCallback: false, // 요청 객체 사용 여부
    }, async (email, password, done) => {
        try {
            // 데이터베이스에서 이메일로 유저 찾기
            const [rows] = await db.execute('SELECT * FROM users WHERE email=?', [email]);
            if (rows.length > 0) {
                // 비밀번호 비교
                const result = await bcrypt.compare(password, rows[0].password);
                if (result) {
                    done(null, rows[0]); // 유저 인증 성공
                } else {
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'}); // 비밀번호 불일치
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'}); // 유저 없음
            }
        } catch (err) {
            console.error(err);
            done(err); // 에러 발생 시 에러 전달
        }
    }));
};
