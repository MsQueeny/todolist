const express = require('express')
const router = express.Router()
const UsersModel = require('../models/users')
const bcrypt = require('bcrypt')
const passwordCheck = require('../utils/passwordCheck')

router.get('/', async (req, res) => {
    const users = await UsersModel.findAll()
    res.status(200).json({
        data: users,
        metadata: "Successful!"
    })
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const users = await UsersModel.findOne({ where: { username: id } })

    if (!users) {
        return res.status(400).json({
            message: 'User not found!'
        })
    } else {
        return res.status(200).json(users)
    }
})

router.post('/', async (req, res) => {
    const { username, nama, password } = req.body

    const encryptedPassword = await bcrypt.hash(password, 10)

    const users = await UsersModel.create({
        username, nama, password: encryptedPassword
    })

    res.status(200).json({
        status: 200,
        data: users,
        metadata: "Created Successful!"
    })
})

router.put('/', async (req, res) => {
    const { username, nama, password, passwordBaru } = req.body

    const check = await passwordCheck(username, password)

    const encryptedPassword = await bcrypt.hash(passwordBaru, 10)

    if (check.compare === true) {
        const users = await UsersModel.update({
            nama, password: encryptedPassword
        }, { where: { username: username } })

        res.json({
            status: 200,
            Users: { updated: users[0] },
            metadata: "Updated Successful!"
        })
    } else {
        res.status(400).json({
            error: "Data Invalid"
        })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const users = await UsersModel.findByPk(id)
    if (!users) {
        return res.status(400).json({
            message: 'User not found!'
        })
    } else {
        await users.destroy()
        return res.status(200).json({
            message: 'Users deleted'
        });
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const check = await passwordCheck(username, password)

    if (check.compare === true) {
        res
            .status(200)
            .json({
                status: 200,
                Users: check.Users,
                metadata: "Login Successful!"
            })
    } else {
        res
            .status(400)
            .json({
                error: "Data Invalid"
            })
    }
})

module.exports = router