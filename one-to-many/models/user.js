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
    User.hasMany(models.Task, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'tasks'
    })
  };
  return User;
};