const { Task } = require('../models')

class TaskController {
    static index(req, res) {
        Task.findAll()
        .then((task) => {
          return res.status(200).json(task)
        })
        .catch((error) => {
          return res.status(400).json(error)
        });
    }
    
    static create(req, res) {
        Task.create({
            title: req.body.title,
            complete: false,
            userId: req.body.userId
        })
        .then((task) => {
            return res.status(200).json(task)
        })
        .catch((error) => {
            return res.status(400).json(error)
        });
    }
    
    static findOne(req, res) {
        Task.findByPk(req.params.id)
        .then((task) => {
          if (!task) {
            return res.status(404).json({ message: 'Task Not Found' });
          }
    
          return res.status(200).json(task);
        })
        .catch((error) => {
          return res.status(400).json(error)
        });
    }
    
    static update(req, res) {
        Task.findByPk(req.params.id)
        .then((task) => {
          if (!task) {
            return res.status(404).json({ message: 'task Not Found' });
          }
    
          task.update({
            ...task, //spread out existing task
            ...req.body //spread out req.body - the differences in the body will override the task returned from DB.
          })
          .then((updatedtask) => {
            return res.status(200).json(updatedtask)
          })
          .catch((error) => {
            return res.status(400).json(error)
          });
        })
        .catch((error) => {
          return res.status(400).json(error)
        });
    }
    
    static destroy(req, res) {
        Task.findByPk(req.params.id)
        .then((task) => {
          if (!task) {
            return res.status(400).json({ message: 'Task Not Found' });
          }
    
          task.destroy()
            .then(() => {
              return res.status(200).json({
                  message: 'Task deleted'
              })
            })
            .catch((error) => {
              return res.status(400).json(error)
            });
        })
        .catch((error) => {
          return res.status(400).json(error)
        });
    }
}

module.exports = TaskController