const router = require('express').Router()
const taskController = require('../controllers/taskController')

router.get('/', taskController.index);
router.post('/', taskController.create);
router.get('/:id', taskController.findOne);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.destroy);

module.exports = router