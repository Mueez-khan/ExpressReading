const express = require("express");
const router = express.Router();
const { reviewBook , editReviewBook , deleteReviewBook , getAllReviewsOfBook , getByReviewsId} = require("../../controllers/ReviewControllers/BookReviewController")
const { authenticateUser } = require("../../middleware/AuthMiddleware");
const upload = require("../../middleware/multer");
const { ReviewComment , EditReviewComment , DeleteReviewComment , getReviewCommentById} = require("../../controllers/ReviewControllers/CommentOnReview");


// **********************************************************************
// **********************************************************************
//                          Review Book routes                          *
// **********************************************************************
// **********************************************************************

router.post('/reviewBook', authenticateUser , upload.single("bookImage") , reviewBook);
router.put('/editReviewBook/:reviewId', authenticateUser , upload.single("bookImage") , editReviewBook);
router.get('/getAllReviewsOfBook', authenticateUser , getAllReviewsOfBook);
router.get('/getByReviewsId/:id', authenticateUser , getByReviewsId);
router.delete('/deleteReviewBook/:reviewId', authenticateUser , deleteReviewBook);

// **********************************************************************
// **********************************************************************
//                          Comment on review routes                    *
// **********************************************************************
// **********************************************************************
 
router.post('/commentOnReview/:postId' , authenticateUser , ReviewComment)
router.put('/editCommentOnReview/:postId' , authenticateUser , EditReviewComment)
router.get('/getAllCommentByIdOfReview/:postId' , authenticateUser , getReviewCommentById)
router.delete('/deleteCommentOnReview/:postId' , authenticateUser , DeleteReviewComment)

module.exports = router;

