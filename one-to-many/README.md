# One to Many
In this tutorial we will be:
- Creating models]
- Creating migrations
- Establishing associations
- Querying based on associations

## Creating Models
With our app setup, we are now ready to generate models. We are going to have two models, Users and Tasks. The relationship between a User and it's Tasks is going to be one-to-many. Another way of saying this is our User can have many Tasks but a Task can only belong to one User.

Lets utilize the power of Sequelize-CLI to generate these files for us.

```bash
> sequelize model:generate --name User --attributes 'firstName:string lastName:string email:string'
```
If you ran this successfully then you should have two new files.  Lets explore the model file it created for you.

`./models/user.js` should look like this:

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
```

We are going to talk about what we changed and why but for now lets go ahead and update our file to look more like this:

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
  const { Model } = sequelize.Sequelize
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User'
  })
  
  User.associate = function(models) {
  };
  return User;
};
```
There are a couple different attributes added to each of our user properties so lets explore each one:

- `allowNull`: this means that for a valid user to be posted to our database that this property is required.  We've made all three of our user's properties required.
- `unique`: this means that (in our case) emails must be unique in our database.  No two users can share the same email.
- `validate`: this topic is much wider and goes beyond the scope of what we are covering but in this case it is validating that the email provided follows typical email formating.  For more on validate check out [the docs](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations).

So now that our app is aware of what a User model looks like we need to inform our database about what the User model looks like. In order to do this we need to explore migrations

## Creating Migrations

we will run our migrations by running `sequelize db:migrate` in our CLI.

Now lets take a look at the migration that was created for us `./migrations/<timestamp>-create-user.js`

```javascript
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
```
Update our file to look more like this:

```javascript
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
```

Now that our model and migration are complete we can run the migration by running `sequelize db:migrate`.

If you make a mistake you have a few options:

- Create a new migration by running `sequelize migration:generate` and in the new migration correct your error then run `sequelize db:migrate`
- Rollback your last migration with `sequelize db:migrate:undo`, edit the migration and then re-run `sequelize db:migrate`
- Rollback all of your migrations with `sequelize db:migrate:undo:all` and start from scratch. Use `sequelize db:migrate:undo:all` with caution as it cleans house.
- For more on migration commands check out [the docs](https://github.com/sequelize/cli#usage).

## Establishing Associations
Now that our User is complete lets create our Task and establish the associations between the two.

Run: `sequelize model:generate --name Task --attributes 'title:String complete:Boolean'`

Update your files to match the following:

`./models/task.js`

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
  const { Model } = sequelize.Sequelize
  class Task extends Model {}
  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Task'
  })
  
  Task.associate = function(models) {
    
  };
  return Task;
};

```


`./migrations/<timestamp>-create-task.js`

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Tasks');
  }
};

```
Notice in the migrations file we added a new property to our Task called `userId`.  This will be the foreign key that sequelize uses when we perform queries.

The last steps in creating the associations happens in each model file. Update your code to each to match the following:

`./models/user.js`

```javascript
 ...
   User.associate = (models) => {
    User.hasMany(models.Task, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'tasks'
    });
  };
 ...
```

`./models/task.js`

```javascript
...
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'tasks'
    });
  };
...
```

Don't forget to `sequelize db:migrate` so that the Tasks table now shows up in your database.

## Querying based on associations

Create your app.js file

```javascript
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const router = require('./router')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(router)

app.listen(PORT,_=>{console.log(`listening on PORT ${PORT}`)})
```

Before we can write the controller code we first need to make a route and controller for our Tasks and wire them up to our app.js

create the router index.js file on `./router/index.js`:

```javascript
const router = require('express').Router()
const taskRouter = require('./taskRouter')
const userRouter = require('./userRouter')

router.use('/tasks', taskRouter)
router.use('/users', userRouter)

module.exports = router
```

### Creating A User

Create `./router/userRouter.js` and add the following code:

```javascript
const router = require('express').Router()
const userController = require('../controllers/userController')

router.get('/', userController.index)
router.post('/', userController.create)
router.get('/:id', userController.findOne)
router.put('/:id', userController.update)

module.exports = router

```

`./controllers/userController.js`

```javascript
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
```

### Creating A Task

Create `./router/taskRouter.js` and add the following code:

```javascript
const router = require('express').Router()
const taskController = require('../controllers/taskController')

router.get('/', taskController.index);
router.post('/', taskController.create);
router.get('/:id', taskController.findOne);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.destroy);

module.exports = router

```

Create `./controllers/taskController.js` and add the following code:

```javascript
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

```

Now you can test all of your rest api using postman or insomnia
