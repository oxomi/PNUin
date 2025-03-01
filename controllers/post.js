const db = require(process.cwd() + '/models');

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
    console.log(req.body);
    try {
        const [postInsertResult] = await db.execute('INSERT INTO posts (title, content, img, userId) VALUES (?, ?, ?, ?)',
            [req.body.title, req.body.content, req.body.url, req.user.id]);
        const [posts] = await db.execute('SELECT * FROM posts WHERE id=?', [postInsertResult.insertId]);
        const post = posts[0];

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};



// 게시글 삭제 기능
exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        // 1. 게시글과 관련된 답변 삭제
        await db.execute('DELETE FROM replies WHERE postId = ?', [postId]);

        // 2. 게시글 삭제
        await db.execute('DELETE FROM posts WHERE id = ?', [postId]);

        res.json({ success: true, message: '게시글이 삭제되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};


