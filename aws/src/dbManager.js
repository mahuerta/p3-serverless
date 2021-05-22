const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    region: "us-east-1"
});

const docClient = new AWS.DynamoDB.DocumentClient();
const tableUsers = 'users';
const tableBooks = 'books';

// USERS
const getAllUsers = () => {
    const params = {
        TableName: tableUsers
    };

    return docClient.scan(params).promise();
};

const addUser = (data) => {
    const params = {
        TableName: tableUsers,
        Item: {
            "userid": uuid.v1(),
            "nick": data.nick,
            "email": data.email,
        }
    };

    return docClient.put(params).promise();
};

const getUserByNick = (nick) => {
    const params = {
        TableName: tableUsers,
        ExpressionAttributeNames: {
            "#nick": "nick",
        },
        ExpressionAttributeValues: {
            ":nick": {
                S: nick
            }
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was deleted
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
        ReturnValues: "ALL_OLD" // Returns the item content before it was deleted
    };

    return docClient.get(params).promise();
};

const getUserComments = async (userid) => {
    const user = await getUser(data.userNick);
    if (!user) {
        // Retornar error
    };
/*
    const params = {
        TableName: tableBooks,
        FilterExpression: "#k_comments.#k_ = :v_Compatible_RAM",
        ExpressionAttributeNames: {
            "#k_comments": "comments",
            "#k_": "RAM"
        },
        ExpressionAttributeValues: {
            ":v_Compatible_RAM": "RAM1"
        }



        ConditionExpression: "comments.user.userid = :userid",
        ExpressionAttributeValues: {
            ":userid": userid
        },
        AttributesToGet: [
            "comments",
            "bookid"
        ],
        ReturnValues: "ALL_OLD" // Returns the item content before it was deleted
    };
    */

    return docClient.get(params).promise();
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
        ReturnValues: "ALL_NEW" // Returns the item content before it was updated
    };

    return docClient.update(params).promise();
};

const deleteUser = (userid) => {
    // Comprobar si tiene o no comentarios y dar un error si los tiene.

    const params = {
        TableName: tableUsers,
        Key: {
            "userid": userid
        },
        ConditionExpression: "userid = :userid",
        ExpressionAttributeValues: {
            ":userid": userid
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was deleted
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

const addBook = (data) => {
    const params = {
        TableName: tableBooks,
        Item: {
            "bookid": uuid.v1(),
            "author": data.author,
            "title": data.title,
            "summary": data.summary,
            "publisher": data.publisher,
            "publicationYear": data.publicationYear,
            "comments": []
        }
    };

    return docClient.put(params).promise();
};

const addCommentToBook = async (bookid, data) => {
    const book = await getBook(bookid);
    
    if (!book) {
        // Retornar error
    };

    const user = await getUserByNick(data.userNick);
    if (!user) {
        // Retornar error
    };

    data.commentid = uid.v1()

    book.comments.push({
        commentid: data.commentid,
        comment: data.comment,
        score: data.score,
        user: {
            "userid": user.id,
            "nick": user.nick
        }
    });

    const params = {
        TableName: tableBooks,
        Key: {
            "bookid": data.bookid
        },
        UpdateExpression: "set comments = :comments",
        ExpressionAttributeValues: {
            ":comments": book.comments
        },
        ReturnValues: "ALL_NEW" 
    };

    return docClient.update(params).promise();

};

const deleteCommentFromBook = async (bookid, commentid, data) => {
    const book = await getBook(bookid);
    
    if (!book) {
        // Retornar error
    };

    book.comments = book.comments.filter(comment => comment.commentid !== commentid);

    const params = {
        TableName: tableBooks,
        Key: {
            "bookid": data.bookid
        },
        UpdateExpression: "set comments = :comments",
        ExpressionAttributeValues: {
            ":comments": book.comments
        },
        ReturnValues: "ALL_NEW" 
    };

    return docClient.update(params).promise();
};

const getBook = (bookid) => {
    const params = {
        TableName: tableBooks,
        Key: {
            "bookid": bookid
        },
        ConditionExpression: "bookid = :bookid",
        ExpressionAttributeValues: {
            ":bookid": bookid
        },
        ReturnValues: "ALL_NEW"
    };

    return docClient.get(params).promise();
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

module.exports = {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    getUser,
    getAllBooks,
    addBook,
    updateBook,
    deleteBook,
    getBook,
    addCommentToBook,
    deleteCommentFromBook
};