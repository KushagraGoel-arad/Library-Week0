'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    biography: {
      type: DataTypes.TEXT,
    },
    born_date: {
      type: DataTypes.DATE,
    }
  });

  Author.associate = (models) => {
    Author.hasMany(models.Book, {
      foreignKey: 'authorId',
      as: 'books'
    });
  };

  return Author;
};


