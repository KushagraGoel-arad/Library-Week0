const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('dev_db', 'librarian1', 'libhead1', {
  host: '127.0.0.1',
  dialect: 'postgres'
});

const Author = require('./models/author')(sequelize, DataTypes);
const Book = require('./models/book')(sequelize, DataTypes);

async function displayData() {
  await sequelize.authenticate();
  
  const authors = await Author.findAll({
    include: 'books'
  });

  console.log(JSON.stringify(authors, null, 2));
}

displayData().catch(console.error).finally(() => {
  sequelize.close();
});
