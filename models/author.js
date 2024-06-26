'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: DataTypes.STRING,
    biography: DataTypes.TEXT,
    born_date: DataTypes.DATE
  }, {});
  Author.associate = function(models) {
    // associations can be defined here
    Author.hasMany(models.Book, {
      foreignKey: 'author_id',
      as: 'books'
    });
  };
  return Author;
};
