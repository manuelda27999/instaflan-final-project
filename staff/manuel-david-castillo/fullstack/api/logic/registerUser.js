const context = require('./helpers/context')
const {validateName, validateEmail, validatePassword} = require('./helpers/validators')

function registerUser(name, email, password) {
    validateName(name)
    validateEmail(email)
    validatePassword(password)

    return context.users.findOne({email})
    .then(user => {
        if (user) throw new Error('user already exists')

        const favPosts = []

        return context.users.insertOne({name, email, password, favPosts})
    })
    .then(()=>{ })
}

module.exports = registerUser