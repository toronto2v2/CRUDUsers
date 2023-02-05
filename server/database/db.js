// Connection to the database
const mongodb = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

mongodb
    .connect("mongodb://localhost/vuejs-crud", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((conn) => {
        global.conn = conn.db("vuejs-crud");
        console.log("Connected to MongoDB!");
    })
    .catch((err) => {
        console.error("Error: Connection failed... " + err);
    });

/**
 * CRUD Users
 */
// Returns documents from the 'users' collection
async function findUsers(callback) {
    return await global.conn.collection("users").find({}).toArray(callback);
}

// Insert a new user in the 'users' collection
async function insertUser(user, callback) {
    return await global.conn.collection("users").insertOne(user, callback);
}

// Update/edit user data in 'users' collection
async function updateUser(id, user) {
    return await global.conn
        .collection("users")
        .updateOne({ _id: new ObjectId(id) }, { $set: user });
}

// Delete a user from the 'users' collection
async function deleteUser(id) {
    return await global.conn
        .collection("users")
        .deleteOne({ _id: new ObjectId(id) });
}

module.exports = { findUsers, insertUser, deleteUser, updateUser };
