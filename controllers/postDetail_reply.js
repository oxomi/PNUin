const db = require(process.cwd() + '/models');

// 답글 달기 기능
exports.addReply = async (req, res, next) => {
    const { content } = req.body;  // 답글 내용
    const postId = req.params.postId;  // 게시글 ID (URL에서 가져옴)
    const userId = req.user.id;  // 현재 로그인된 사용자의 ID

    try {
        // 답글을 replies 테이블에 저장
        await db.execute('INSERT INTO replies (postId, userId, content) VALUES (?, ?, ?)', [postId, userId, content]);
        res.redirect(`/post/${postId}`);  // 답글 작성 후 해당 게시글 상세 페이지로 리디렉션
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 답글 삭제 기능
exports.deleteReply = async (req, res, next) => {
    const { replyId } = req.body; // 클라이언트에서 replyId를 전달받음
    const userId = req.user.id; // 현재 로그인한 사용자 ID
    const postId = req.params.postId; // 게시글 ID

    try {
        // 답글이 존재하는지 확인
        const [replyRows] = await db.execute('SELECT userId FROM replies WHERE id = ? AND postId = ?', [replyId, postId]);
        if (replyRows.length === 0) {
            return res.status(404).send('답글을 찾을 수 없습니다.');
        }

        const reply = replyRows[0];

        // 답글 작성자 확인
        if (reply.userId !== userId) {
            return res.status(403).send('삭제 권한이 없습니다.');
        }

        // 답글 삭제
        await db.execute('DELETE FROM replies WHERE id = ?', [replyId]);

        res.sendStatus(200); // 성공적으로 삭제 완료
    } catch (err) {
        console.error(err);
        next(err);
    }
};


