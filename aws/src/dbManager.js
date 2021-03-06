const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    region: "us-east-1"
});

const docClient = new AWS.DynamoDB.DocumentClient();
const tableUsers = 'users';
const tableBooks = 'books';
const tableComments = 'comments';

// USERS
const getAllUsers = () => {
    const params = {
        TableName: tableUsers
    };

    return docClient.scan(params).promise();
};

const addUser = async (data) => {
    const params = {
        TableName: tableUsers,
        Item: {
            "userid": uuid.v1(),
            "nick": data.nick,
            "email": data.email,
        }
    };
    await docClient.put(params).promise();

    return params.Item;
};

const getUserByNick = (nick) => {
    const params = {
        ExpressionAttributeValues: {
            ":nick": nick
        }, 
        FilterExpression: "nick = :nick", 
        TableName: tableUsers
    };

    return docClient.scan(params).promise();
};

const getUser = (userid) => {
    const params = {
        TableName: tableUsers,
        Key: {
            "userid": userid
        },
        ConditionExpression: "userid = :userid",
        ExpressionAttributeValues: {
            ":userid": userid
        },
        ReturnValues: "ALL_OLD"
    };

    return docClient.get(params).promise();
};

const getUserComments = async (userid) => {
    const user = await getUser(userid);
    if (!user.Item) { 
        throw new LibraryException("User not found", 404);
    };

    const params = {
        ExpressionAttributeValues: {
            ":userid": userid
        }, 
        FilterExpression: "userid = :userid", 
        TableName: tableComments
    };

    return docClient.scan(params).promise();

};

const updateUser = (data) => {
    const params = {
        TableName: tableUsers,
        Key: {
            "userid": data.userid
        },
        UpdateExpression: "set email = :e",
        ExpressionAttributeValues: {
            ":e": data.email
        },
        ReturnValues: "ALL_NEW" 
    };

    return docClient.update(params).promise();
};

const deleteUser = async (userid) => {
    const user = await getUser(userid);
    if (!user.Item) {
        throw new LibraryException("User not found", 404);
    };

    const comments = await getUserComments(userid);

    if(comments.Count>0){
        throw new LibraryException("User has comments", 409);
    }

    const params = {
        TableName: tableUsers,
        Key: {
            "userid": userid
        },
        ConditionExpression: "userid = :userid",
        ExpressionAttributeValues: {
            ":userid": userid
        },
        ReturnValues: "ALL_OLD" 
    };

    return docClient.delete(params).promise();
};

// BOOKS
const getAllBooks = () => {
    const params = {
        TableName: tableBooks,
        AttributesToGet: [
            "title",
            "bookid"
        ]
    };

    return docClient.scan(params).promise();
};

const addBook = async (data) => {
    const params = {
        TableName: tableBooks,
        Item: {
            "bookid": uuid.v1(),
            "author": data.author,
            "title": data.title,
            "summary": data.summary,
            "publisher": data.publisher,
            "publicationYear": data.publicationYear
        }
    };

    await docClient.put(params).promise()
    return params.Item;
};

const addCommentToBook = async (bookid, data) => {
    const book = await getBook(bookid);
    
    if (!book) {
        throw new LibraryException("Book not found", 404);
    };

    const user = await getUserByNick(data.userNick);
    if (user.Count == 0) {
        throw new LibraryException("User not found", 404);
    };

    const params = {
        TableName: tableComments,
        Item: {
            "commentid": uuid.v1(),
            "comment": data.comment,
            "score": data.score,
            "userid": user.Items[0].userid, 
            "userNick": user.Items[0].nick, // El userNick no se puede actualizar 
            "bookid": book.Item.bookid
        }
    };

    await docClient.put(params).promise()

    return params.Item;

};

const deleteCommentFromBook = async (bookid, commentid, data) => {
    const book = await getBook(bookid);
    
    if (!book) {
        throw new LibraryException("Book not found", 404);
    };

    const params = {
        TableName: tableComments,
        Key: {
            "commentid": commentid
        },
        ConditionExpression: "commentid = :commentid",
        ExpressionAttributeValues: {
            ":commentid": commentid
        },
        ReturnValues: "ALL_OLD"
    };

    return docClient.delete(params).promise();
};

const getBook = async (bookid) => {
    const comments = await getBookComments(bookid);

    const params = {
        TableName: tableBooks,
        Key: {
            "bookid": bookid
        },
        ConditionExpression: "bookid = :bookid",
        ExpressionAttributeValues: {
            ":bookid": bookid
        },
        ReturnValues: "ALL_OLD"
    };

    const book = await docClient.get(params).promise();
    book.Item.comments = comments;
    return book;
};

const getBookComments = (bookid) => {
    const params = {
        ExpressionAttributeValues: {
            ":bookid": bookid
        }, 
        FilterExpression: "bookid = :bookid", 
        TableName: tableComments
    };

    return docClient.scan(params).promise();
};

const updateBook = (data) => {
    const params = {
        TableName: tableBooks,
        Key: {
            "bookid": data.bookid
        },
        UpdateExpression: "set author = :author, title = :title, summary = :summary, publisher = :publisher, publicationYear = :publicationYear",
        ExpressionAttributeValues: {
            ":author": data.author,
            ":title": data.title,
            ":summary": data.summary,
            ":publisher": data.publisher,
            ":publicationYear": data.publicationYear
        },
        ReturnValues: "ALL_NEW" 
    };

    return docClient.update(params).promise();
};

const deleteBook = (bookid) => {
    const params = {
        TableName: tableBooks,
        Key: {
            "bookid": bookid
        },
        ConditionExpression: "bookid = :bookid",
        ExpressionAttributeValues: {
            ":bookid": bookid
        },
        ReturnValues: "ALL_OLD" 
    };

    return docClient.delete(params).promise();
};


 function LibraryException(message, status) {
    return {
        "message": message,
        "status": status
    };
 }
 
module.exports = {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    getUser,
    getUserByNick,
    getAllBooks,
    addBook,
    updateBook,
    deleteBook,
    getBook,
    addCommentToBook,
    deleteCommentFromBook,
    getUserComments
};