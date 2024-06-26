'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    published_date: DataTypes.DATE,
    authorId: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
   
    Book.belongsTo(models.Author, {
      foreignKey: 'authorId',
      as: 'author'
    });
  };
  return Book;
};
