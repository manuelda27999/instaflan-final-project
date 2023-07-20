const context = require('./helpers/context')
const {validateEmail, validatePassword} = require('./helpers/validators')

function authenticateUser(email, password) {
    validateEmail(email)
    validatePassword(password)

    return context.users.findOne({email})
        .then(user => {
            if(!user) throw new Error('user not found')

            if(user.password !== password) throw new Error('wrong credentials')

            return user._id.toString()
        })
}

module.exports = authenticateUser