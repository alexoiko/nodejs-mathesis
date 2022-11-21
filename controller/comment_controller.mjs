import * as BookList from '../model/booklist_model.mjs' // version 3 with ORM sequelize, postgress
import { Book, User, BookUser} from '../model/bookList_seq_pg.mjs'

async function showCommentList(req, res, next) {
    try {
        const myComment = await BookList.loadComments(req.session.username, req.params.title, "mine")
        const comments = await BookList.loadComments(req.session.username, req.params.title, "notme")
        //const books = await BookList.loadBooks(req.session.username)
        const book = await Book.findOne({ where: { title: req.params.title } });
        
        res.render("addcommentform", { myComment: myComment, comments: comments, book: book, username: req.session.username })
    } catch (error) {
        next(error)
    }
}

const addComment = async (req, res, next) => {

    try {
        await BookList.addComment(
            req.body["newComment"], 
            req.session.username,
            req.body["newBookTitle"]
        )
        next() //επόμενο middleware είναι το showBookList
    }
    catch (error) {
        next(error) //αν έγινε σφάλμα, με το next(error) θα κληθεί το middleware με τις παραμέτρους (error, req, res, next)
    }
}

const deleteComment = async (req, res, next) => {
    const title = req.params.title;
    try {
        //const bookList = new BookList(req.session.username)
        await BookList.deleteComment(title , req.session.username)
        next() //επόμενο middleware είναι το BookController.showBookList
    }
    catch (error) {
        next(error)//αν έγινε σφάλμα, με το next(error) θα κληθεί το middleware με τις παραμέτρους (error, req, res, next)
    }
}

export{showCommentList, addComment, deleteComment}