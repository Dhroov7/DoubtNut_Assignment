const Sequelize = require("sequelize");
const db = new Sequelize({
  dialect: "sqlite",
  storage: "./doubtnut.sqlite",
  logging: console.log
});

const user = db.define('user', {
    name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


db.sync()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = {
    db, models: {user: user}
}