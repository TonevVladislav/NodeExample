# NodeExample

This project aims to provide stable api server basic CRUD operations, as well as blockchain data retreival, such as getting address transactions and storing events for smart contract.

Used technologies:
-API server - Express - well known, well documented, can be changed depending on the client preferences and needs
-Requests - Axios - Well known library for request handling
-Password hashing and comparing - Bcrypt - reliable hash and compare operations
-Used authentication - jsonwebtoken
-Cookies handling (required for the refresh token) - cookie parser
-Cross-origin api calls configuration - CORS
-Handling environmental variables - DOTENV
-Blockchain data retreival, blockchain communication - ethers
-Rate limiter - express rate limiter
-Status codes - http status codes
-Logger - winston
-Database (non-relational): mongodb

Api endpoints:

AUTHENTICATION:

POST http://localhost:9000/v1/auth/login
BODY raw(json) : {
"email": "email@maiwal.com",
"password": "password2"
}, RES:{
"accessToken": "jwt_token",
"refreshToken": "refresh_token",
"expiresIn": 3600
}

POST http://localhost:9000/v1/auth/register
BODY raw(json) : {
"email": "email@maiwal.com",
"password": "password2",
"username": "username3"
}, RES: {
"id": "uuid",
"email": "string",
"username": "string",
"createdAt": "timestamp"
}

POST http://localhost:9000/v1/auth/refresh
HEADERS: {Cookie: refreshToken},
RES:{
"accessToken": "jwt_token",
"expiresIn": 3600
}

POST http://localhost:9000/v1/auth/logout
HEADERS: {Cookie: refreshToken},
RES: { status: 204}

USER:

GET USER
GET http://localhost:9000/v1/users/me
HEADERS: Authorization: Bearer {token},
RES: {
"id": "uuid",
"email": "string",
"username": "string",
"createdAt": "timestamp",
"updatedAt": "timestamp"
}

UPDATE USERNAME
PUT http://localhost:9000/v1/users/me
HEADERS: Authorization: Bearer {token},
BODY raw(json) : {
"username": "string",
"email": "string"
}, RES: {
"id": "uuid",
"email": "string",
"username": "string",
"createdAt": "timestamp",
"updatedAt": "timestamp"
}

UPDATE PASSWORD
PUT http://localhost:9000/v1/users/me/password
HEADERS: Authorization: Bearer {token},
BODY raw(json) : {
"currentPassword": "string",
"newPassword": "string"
}, RES: { status: 204}

TRANSACTION DATA:

GET TRANSACTIONS BY BLOCK (OPTIONAL QUERY PARAMS: fromBlock, toBlock)
GET http://localhost:9000/v1/eth/address/:address/transactions
RES: {
"id": "uuid",
"email": "string",
"username": "string",
"createdAt": "timestamp",
"updatedAt": "timestamp"
}

CONTRACT EVENTS:

START INDEXING EVENTS FOR PROVIDED ADDRESS (OPTIONAL QUERY PARAMS: fromBlock, toBlock)
POST http://localhost:9000/v1/eth/contracts/:address/watch
RES: { status: 200}

RETREIVE SAVED EVENTS FROM DB (OPTIONAL QUERY PARAMS: fromBlock, toBlock)
GET http://localhost:9000/v1/eth/contracts/:address/events
RES:{
"events": [
{
"blockNumber": "number",
"transactionHash": "0x...",
"data": {
"from": "0x...",
"to": "0x...",
"value": "number"
},
"timestamp": "timestamp"
}
],
"indexerStatus": {
"lastIndexedBlock": "number",
"isIndexing": true
},
}

STOP INDEXING EVENTS FOR PROVIDED ADDRESS
DELETE http://localhost:9000/v1/eth/contracts/:address/watch
RES: { "status": "stopped",
"lastIndexedBlock": "number"
}
