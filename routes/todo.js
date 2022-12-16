const express = require('express')
const TodoModel = require('../models/todo')
const router = express.Router()

router.get('/', async (req, res) => {
    const todo = await TodoModel.findAll()
    res.status(200).json({
        data: todo,
        metadata: "Successful!"
    })
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const todo = await TodoModel.findAll({ where: { userid: id } })

    if (!todo) {
        return res.status(400).json({
            message: 'Todo List not found!'
        })
    } else {
        return res.status(200).json(todo)
    }
})

router.get('/update/:id', async (req, res) => {
    const id = req.params.id

    const todo = await TodoModel.findAll({ where: { title: id } })

    if (!todo) {
        return res.status(400).json({
            message: 'Todo List not found!'
        })
    } else {
        return res.status(200).json(todo)
    }
})

router.post('/', async (req, res) => {
    const { title, desc, date, status, userid } = req.body

    const todo = await TodoModel.create({
        title, desc, date, status, userid
    })

    res.status(200).json({
        status: 200,
        data: todo,
        metadata: "Created Successful!"
    })
})

router.put('/', async (req, res) => {
    const { title, desc, date } = req.body
    const todo = await TodoModel.findOne({ where: { title: title } })

    if (!todo) {
        return res.status(400).json({ message: 'Data Invalid' })
    } else {
        const todos = await todo.update({ desc, date })
        return res
            .json({
                status: 200,
                Todo: { updated: todos },
                metadata: "Updated Successful!"
            })
    }
})

router.put('/status/:id', async (req, res) => {
    const id = req.params.id
    const { status } = req.body
    const todo = await TodoModel.findByPk(id)

    if (!todo) {
        return res.status(400).json({ message: 'Data Invalid' })
    } else {
        const todos = await todo.update({ status })
        return res
            .json({
                status: 200,
                Todo: { updated: todos },
                metadata: "Updated Successful!"
            })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const todo = await TodoModel.findByPk(id)

    if (!todo) {
        return res.status(400).json({
            message: 'Todo List not found!'
        })
    } else {
        await todo.destroy()
        return res.status(200).json({
            message: 'Todo List deleted'
        });
    }
})

module.exports = router