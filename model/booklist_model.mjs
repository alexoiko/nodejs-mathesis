import { Book, User, BookUser} from './bookList_seq_pg.mjs'
import bcrypt from 'bcrypt'
import { Op, ValidationError } from "sequelize"

// ----------------------  User Register/ Login  --------------------------------
async function addUser(username, password) {
    try {
        if (!username || !password)
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")

        let user = await User.findOne({ where: { name: username } })

        if (user)
            throw new Error("Υπάρχει ήδη χρήστης με όνομα " + username)

        const hash = await bcrypt.hash(password, 10)
        user = await User.create({ name: username, password: hash })
        return user
    } catch (error) {
        throw error
    }
}

async function login(username, password) {
    try {
        if (!username || !password)
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")

        let user = await User.findOne({ where: { name: username } })

        if (user){
            //wrongusermessage: "Δεν υπάρχει χρήστης με αυτό το όνομα"
            const match = await bcrypt.compare(password, user.password)
            if (match)
                return user
            //else
            //throw new Error("Λάθος στοιχεία πρόσβασης")
        }
    }catch (error) {
        throw error
    }
}


// ----------------------  add/load/delete books  --------------------------------
async function loadBooks(username) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("άγνωστος χρήστης")

        const myBooks = await user.getBooks({ raw: true }); //με raw επιστρέφεται το "καθαρό" αντικείμενο (ο πίνακας) χωρίς πληροφορίες που αφορούν τη sequelize  
        return myBooks
    } catch (error) {
        throw error
    }
}

async function addBook(newBook, username) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("άγνωστος χρήστης")

        
        const [book, created] = await Book.findOrCreate({
            where: {
                title: newBook.title,
                author: newBook.author
            }
        })
        
        await user.addBook(book)
    } catch (error) {
        throw error
    }
}

// το βιβλίο διαγράφεται από τον πίνακα "BookUser" 
async function deleteBook(book, username) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("άγνωστος χρήστης")

        const bookToRemove = await Book.findOne({ where: { title: book.title } })
        
        await bookToRemove.removeUser(user)

        // check if other users have the book
        const numberOfUsers = await bookToRemove.countUsers()
        // if no other user has the book then remove it
        if (numberOfUsers == 0) {
            Book.destroy({
                where: {
                    title: book.title
                }
            })
        }

    } catch (error) {
        throw error
    }
}

// ----------------------  add/load/delete comments  --------------------------------
async function loadComments(username, title, choice) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("άγνωστος χρήστης")

        if (choice=="mine"){
            const comments = await BookUser.findOne({ where: { BookTitle: title,  UserName: username}});
            return comments
        }
        else{
            const comments = await BookUser.findAll({ where: { BookTitle: title , UserName: {[Op.ne]: username} , comment: {[Op.ne]: null}} });
            return comments
        }
    
        
    } catch (error) {
        throw error
    }
}

async function addComment(comment, username, title) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")
        
        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("Άγνωστος χρήστης")

        const book = await BookUser.update({comment: comment }, {where: {BookTitle: title, UserName: username}});
        if (!book)
            throw new Error("Σφάλμα")

    } catch (error) {
        throw error
    }
}


// το βιβλίο διαγράφεται από τον πίνακα "BookUser" 
async function deleteComment(title , username) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("άγνωστος χρήστης")

        await BookUser.update({comment: null}, { where: { BookTitle: title, UserName: username } })


    } catch (error) {
        throw error
    }
}



// async function findOrAddUser(username) {
//     //στο this.user θα φυλάσσεται το αντικείμενο που αντιπροσωπεύει τον χρήστη στη sequelize
//     //αν δεν υπάρχει, τότε το ανακτούμε από τη sequalize
//     //αλλιώς, υπάρχει το this.user και δεν χρειάζεται να κάνουμε κάτι άλλο
//     const user = await User.findOne({ where: { name: username } });
//     if (user == undefined)
//         try {
//             const [usern, created] = await User.findOrCreate({ where: { name: username } })
//             user = usern
//         } catch (error) {
//             throw error
//         }
// }

export { addUser, login, loadBooks, addBook, deleteBook, loadComments, addComment, deleteComment}