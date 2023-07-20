const express = require('express')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const context = require('./logic/helpers/context')

const authenticateUser = require('./logic/authenticateUser')
const registerUser = require('./logic/registerUser')

const {MongoClient} = mongodb

const client = new MongoClient("mongodb://127.0.0.1:27017")

client.connect()
    .then((connection) => {
        context.users = connection.db('instaflan-data').collection('users')
        context.posts = connection.db('instaflan-data').collection('posts')

        const api = express()

        const jsonBodyParser = bodyParser.json()

        api.use(cors())

        api.post('/users/auth', jsonBodyParser, (req, res) => {
            try {
                const {email, password} = req.body 

                authenticateUser(email, password)
                .then((userId) => {
                    const data = {sub: userId}

                    const token = jwt.sign(data, 'papi ya tu sabeh')

                    res.json(token)
                })
                .catch(error => res.status(400).json({error: error.message}))
            } catch (error) {
                res.status(400).json({error: error.message})
            }
        })

        api.post('/users', jsonBodyParser, (req, res) => {
            try {
                const {name, email, password} = req.body

                registerUser(name, email, password)
                .then(()=> {res.status(201).send()})
                .catch((error) => res.status(400).json({error: error.message}))
            }
            catch (error) {
                res.status(400).json({error: error.message})
            }
        })

        api.listen(8000, () => console.log('Servidor lanzado en puerto 8000'))
    })