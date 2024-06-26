'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: DataTypes.STRING,
    biography: DataTypes.TEXT,
    born_date: DataTypes.DATE
  }, {});
  Author.associate = function(models) {
    
    Author.hasMany(models.Book, {
      foreignKey: 'authorId',
      as: 'books'
    });
  };
  return Author;
};
