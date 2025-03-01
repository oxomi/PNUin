const db = require(process.cwd() + '/models');

// 게시글 상세 페이지 조회
exports.renderPostDetail = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        // 게시글 조회
        const [postRows] = await db.execute('SELECT p.*, u.nick AS userNick FROM posts p JOIN users u ON p.userId = u.id WHERE p.id = ?', [postId]);
        const post = postRows[0];

        // 해당 게시글에 달린 답글 조회
        const [replyRows] = await db.execute('SELECT r.*, u.nick AS userNick FROM replies r JOIN users u ON r.userId = u.id WHERE r.postId = ? ORDER BY r.createdAt ASC', [postId]);

        res.render('postDetail', {
            post: post,
            replies: replyRows,  // 답글 목록 전달
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};





