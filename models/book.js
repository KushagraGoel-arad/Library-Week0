'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
    },
    published_date: {
      type: DataTypes.DATE,
    },
    authorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Authors',
        key: 'id'
      }
    }
  });

  Book.associate = (models) => {
    Book.belongsTo(models.Author, {
      foreignKey: 'authorId',
      as: 'author'
    });
  };

  return Book;
};
