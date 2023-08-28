require('dotenv').config()
const retrieveUser = require('./retrieveUser')
const mongoose = require('mongoose')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => retrieveUser('64be4f673d55f3b03ce22b11', '64c2a23b49d5974c2c044baf'))
    .then((user) => console.log(user))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())