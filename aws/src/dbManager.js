const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    region: "us-east-1"
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'users';

// USERS
const getAllUsers = () => {
    const params = {
        TableName: table
    };

    return docClient.scan(params).promise();
};

const addUser = (data) => {
    const params = {
        TableName: table,
        Item: {
            "userid": uuid.v1(),
            "nick": data.nick,
            "email": data.email,
        }
    };

    return docClient.put(params).promise();
};

const getUser = (userid) => {
    const params = {
        TableName: table,
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

const updateUser = (data) => {
    const params = {
        TableName: table,
        Key: {
            "userid": data.userid
        },
        UpdateExpression: "set #na = :n, email = :e",
        ExpressionAttributeNames: { // Used when there are reserved words in DynamoDB, like name
            "#na": 'nick'
        },
        ExpressionAttributeValues: {
            ":n": data.nick,
            ":e": data.email
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was updated
    };

    return docClient.update(params).promise();
};

const deleteUser = (userid) => {
    const params = {
        TableName: table,
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
        TableName: table
    };

    return docClient.scan(params).promise();
};

const addBook = (data) => {
    const params = {
        TableName: table,
        Item: {
            "bookid": uuid.v1(),
            "author": data.author,
            "title": data.title,
            "summary": data.summary,
            "publisher": data.publisher,
            "publicationYear": data.publicationYear
        }
    };

    return docClient.put(params).promise();
};

const getBook = (bookid) => {
    const params = {
        TableName: table,
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
        TableName: table,
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
        TableName: table,
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
    getBook
};