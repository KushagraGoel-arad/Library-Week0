'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    published_date: DataTypes.DATE,
    author_id: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
    Book.belongsTo(models.Author, {
      foreignKey: 'author_id',
      as: 'author'
    });
  };
  return Book;
};
