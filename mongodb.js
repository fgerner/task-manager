const faker = require('faker');

const {MongoClient, ObjectID} = require('mongodb');

const id = new ObjectID();

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log('Connection error');
    }
    const db = client.db(databaseName);

    db.collection('tasks').find({completed: true}).toArray((error, task) => {
        if (error){
            return console.log(error)
        }
        console.log(task)
    })

    
})