const mongoose = require('mongoose');

//options for mongoose database
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
//exported commands
module.exports = {
    connect: DB_HOST => {mongoose.connect(DB_HOST,options)}, //connects with dbhost and options
    close: () => {
        mongoose.connection.close();
    }
};