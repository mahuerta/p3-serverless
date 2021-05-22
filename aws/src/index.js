'use strict';

// dbManager file will have DynamoDB functionality in further changes. For now, it just uses mocked data to test a REST Api
const dbManager = require('./dbManager');

exports.usersHandler = (event, context, callback) => {
    switch (event.httpMethod) {
        case 'GET' :
            if (!!event.pathParameters && !!event.pathParameters.userid) {
                getUser(event.pathParameters.userid, callback);
            } else {
                getAllUsers(callback);
            }
            break;
        case 'POST':
            addUser(event.body, callback);
            break;
        case 'PUT':
            updateUser(event.pathParameters.userid, event.body, callback);
            break;
        case 'DELETE':
            deleteUser(event.pathParameters.userid, callback);
            break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};

exports.booksHandler = (event, context, callback) => {
    switch (event.httpMethod) {
        case 'GET' && !(!!event.pathParameters.bookid):
            getAllBooks(callback);
            break;
        case 'GET' && !!event.pathParameters.bookid:
            getBook(callback);
            break;
        case 'POST':
            addBook(event.body, callback);
            break;
        case 'PUT':
            updateBook(event.pathParameters.bookid, event.body, callback);
            break;
        case 'DELETE':
            deleteBook(event.pathParameters.bookid, callback);
            break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};

const getAllUsers = (callback) => {
    dbManager.getAllUsers()
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const getUser = (userId, callback) => {
    dbManager.getUser(userId)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const addUser = (data, callback) => {
    data = JSON.parse(data);

    dbManager.addUser(data)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const updateUser = (userid, data, callback) => {
    data = JSON.parse(data);
    data.userid = userid;

    dbManager.updateUser(data)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const deleteUser = (userid, callback) => {
    dbManager.deleteUser(userid)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};


// CRUD DE BOOKS
const getAllBooks = (callback) => {
    dbManager.getAllBooks()
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const getBook = (bookid, callback) => {
    dbManager.getBook(bookid)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const addBook = (data, callback) => {
    data = JSON.parse(data);

    dbManager.addBook(data)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const updateBook = (bookid, data, callback) => {
    data = JSON.parse(data);
    data.bookid = bookid;

    dbManager.updateBook(data)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const deleteBook = (bookid, callback) => {
    dbManager.deleteBook(bookid)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(200, err, callback);
    });
};

const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
    callback(null, res);
};