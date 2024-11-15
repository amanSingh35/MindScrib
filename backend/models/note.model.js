const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User=require("./user.model");

const Note = sequelize.define("Note", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER, // Foreign key for the User model
    allowNull: false,
  },
  createdOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Establish relationship between Note and User
Note.belongsTo(User, { foreignKey: 'userId' });

module.exports = Note;
