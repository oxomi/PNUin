const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost /*Todo controller/post에서 기능만들기 및 가져오기 */, likePost, unlikePost, deletePost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');
const { renderPostDetail} = require("../controllers/postDetail");
const { addReply, deleteReply} = require('../controllers/postDetail_reply');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (err) {
    console.error('uploads 폴더 없음: 폴더 생성');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// 게시글 작성 라우팅
// POST /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

// 이미지 업로드 라우팅
// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// 게시글 삭제 라우팅
// /post/${postId}
router.delete('/:postId', isLoggedIn, deletePost)

// 게시글 상세 페이지 라우팅
// GET /post/${postId}
router.get('/:postId', isLoggedIn, renderPostDetail);


// 게시글 상세 페이지 답글 작성 라우팅
router.post('/:postId/reply', isLoggedIn, addReply);

// 게시글 상세 페이지 답글 삭제 라우팅
router.delete('/:postId/reply', isLoggedIn, deleteReply);

module.exports = router;