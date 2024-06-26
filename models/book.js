'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    published_date: {
      type: DataTypes.DATE,
    },
  });

  Book.associate = (models) => {
    Book.belongsTo(models.Author, { foreignKey: 'authorId' });
  };

  return Book;
};
