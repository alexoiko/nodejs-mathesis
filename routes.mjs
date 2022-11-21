import express from 'express'
// use different models to demonstrate connection to different databases
import * as Validator from './validator/validation.mjs'
import * as UserController from './controller/user_controller.mjs'
import * as BookController from './controller/book_controller.mjs'
import * as CommentController from './controller/comment_controller.mjs'

const router = express.Router()

//αν υπάρχει ενεργή συνεδρία, ανακατεύθυνε στο /books
router.get("/", (req, res) => {
    if (req.session.username)
        res.redirect("/books")
    else
        res.render("home")
})


//έλεγξε αν έχει συνδεθεί ο χρήστης, μετά δείξε τα βιβλία
router.get("/books", UserController.checkIfAuthenticated, BookController.showBookList)

//δείξε τη φόρμα εισαγωγής νέου βιβλίου
router.get("/addbookform", UserController.checkIfAuthenticated, (req, res) => {
    res.render("addbookform")
})

//αυτή η διαδρομή υποδέχεται τη φόρμα εισόδου
router.post("/books",
    Validator.validateLogin,
    UserController.doLogin,
    BookController.showBookList)


//υποδέχεται την φόρμα υποβολής νέου βιβλίου
router.post("/doaddbook",
    UserController.checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    Validator.validateNewBook,
    BookController.addBook,
    BookController.showBookList)

//router.get("/comments", UserController.checkIfAuthenticated, CommentController.showCommentList)

//δείξε τη φόρμα εισαγωγής νέου σχολίου
router.get("/addcommentform/:title", UserController.checkIfAuthenticated, CommentController.showCommentList, (req, res) => {
    res.render("addcommentform")
})

//υποδέχεται την φόρμα υποβολής νέου σχολίου
router.post("/addcomment/:title",
    UserController.checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    Validator.validateNewComment,
    CommentController.addComment,
    CommentController.showCommentList)

router.get("/deletecomment/:title",
    UserController.checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    CommentController.deleteComment,
    CommentController.showCommentList);



// διαγραφή ενός βιβλίου με τίτλο title από τη λίστα του χρήστη
router.get("/delete/:title",
    UserController.checkIfAuthenticated, //έλεγξε αν έχει συνδεθεί ο χρήστης,
    BookController.deleteBook,
    BookController.showBookList);

router.get("/logout", UserController.doLogout, (req, res) => {
    res.redirect("/")
})

router.get("/register", (req, res) => {
    res.render("registrationform")
})

router.post("/doregister",
    Validator.validateNewUser,
    UserController.doRegister)

export { router }