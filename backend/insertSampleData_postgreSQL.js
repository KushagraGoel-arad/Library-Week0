const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('dev_db', 'librarian1', 'libhead1', {
  host: '127.0.0.1',
  dialect: 'postgres'
});

const Author = require('./models/author')(sequelize, DataTypes);
const Book = require('./models/book')(sequelize, DataTypes);

Author.associate({ Book });
Book.associate({ Author });

async function insertData() {
  await sequelize.sync({ force: true });

  const author = await Author.create({
    name: ' Harper Lee',
    biography: 'Author biography...',
    born_date: '1973-01-02'
  });

  const book = await Book.create({
    title: 'To Kill a Mockingbird',
    description: 'A classic novel about racial injustice, tolerance, and the loss of innocence in a small Alabama town during the 1930s.',
    published_date: '2002-01-01',
    authorId: author.id
  });

  console.log('Data inserted');
}

insertData().catch(console.error).finally(() => {
  sequelize.close();
});
