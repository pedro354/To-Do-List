const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();


router.get('/tasks', taskController.index)
router.get('/tasks/:id', taskController.show)
router.post('/tasks', taskController.create)
router.put('/tasks/:id', taskController.update)
router.delete('/tasks/:id', taskController.delete)
router.delete('/tasks', taskController.deletedAllTasks);
module.exports = router;
 