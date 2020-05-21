const router = require('express').Router()
const taskRouter = require('./taskRouter')
const userRouter = require('./userRouter')

router.use('/tasks', taskRouter)
router.use('/users', userRouter)

module.exports = router