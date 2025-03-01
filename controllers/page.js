const db = require(process.cwd() + '/models');
const { getUserStats } = require('../utils/userStats');

exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
};

exports.renderMain = async (req, res, next) => {
    try {
        const [posts] = await db.execute(`
            SELECT p.*, u.id userId, u.nick userNick
            FROM posts p
            JOIN users u ON p.userId = u.id
            GROUP BY p.id
            ORDER BY p.createdAt DESC
        `);

        // 데이터 확인
        console.log('posts 데이터:', posts);

        const twits = posts.map((post) => ({
            ...post,
            likedusers: [], // likedusers 필드 비워둠
        }));

        // 사용자 질문 수 및 답변 수 가져오기
        let questionCount = 0;
        let answerCount = 0;
        if (req.user) {
            const stats = await getUserStats(req.user.id); // getUserStats 호출
            questionCount = stats.questionCount;
            answerCount = stats.answerCount;
        }

        res.render('main', {
            title: 'NodeBird',
            twits,
            user: req.user ? { ...req.user, questionCount, answerCount } : null,
            darkMode: res.locals.darkMode,
        });

        // 디버깅 로그 추가
        console.log('user 객체 전달 확인:', req.user ? { ...req.user, questionCount, answerCount } : null);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.renderSearch = async (req, res, next) => {
    const query = req.query['search-tag']; // 검색어 가져오기
    if (!query) {
        return res.redirect('/'); // 검색어가 없으면 홈으로 리디렉션
    }

    try {
        // `posts` 테이블에서 `title` 또는 `content`에 키워드 포함된 게시글 찾기
        const [rows] = await db.execute(
            `SELECT id, title, content, img, createdAt 
             FROM posts 
             WHERE title LIKE ? OR content LIKE ? 
             ORDER BY createdAt DESC`,
            [`%${query}%`, `%${query}%`] // 키워드를 LIKE 조건으로 적용
        );

        // 검색 결과가 없을 때 처리
        if (rows.length === 0) {
            return res.render('main', {
                title: `${query} 검색 결과`,
                twits: [], // 검색 결과가 없으면 빈 배열 전달
                message: '검색 결과가 없습니다.',
            });
        }

        // 검색된 결과 렌더링
        res.render('main', {
            title: `${query} 검색 결과`,
            twits: rows, // 검색된 게시글 리스트 전달
        });
    } catch (err) {
        console.error('검색 중 오류 발생:', err);
        next(err);
    }
};