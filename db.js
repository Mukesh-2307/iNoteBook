const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/iNoteBook"

const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI) 
        console.log('sucessfully connected to Mongo')
    }
    catch(error) {
        console.log(error)
        process.exit()
    }
    }

module.exports = connectToMongo;