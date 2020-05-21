const { User, Task } = require('../models')

class UserController {
    static create(req,res) {
        User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
          })
          .then((user) => {
            return res.status(200).json(user)
          })
          .catch((error) => {
            return res.status(400).json(error)
          });
    }

    static index(req,res) {
        User.findAll({
            include: [{
              model: Task,
              as: 'tasks'
            }]
        })
        .then((user) => {
        return res.status(200).json(user)
        })
        .catch((error) => {
        return res.status(400).json(error)
        });
    }

    static findOne(req,res) {
      User.findByPk(req.params.id, {
        include: [{
          model: Task,
          as: 'tasks',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId']
          }
        }]
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User Not Found' });
        }
  
        return res.status(200).json(user);
      })
      .catch((error) => {
        return res.status(400).json(error)
      });
    }

    static update(req,res) {
      User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User Not Found' });
        }
  
        user.update({
          ...user, //spread out existing user
          ...req.body //spread out req.body - the differences in the body will override the user returned from DB.
        })
        .then((updatedUser) => {
          return res.status(200).json(updatedUser)
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

module.exports = UserController