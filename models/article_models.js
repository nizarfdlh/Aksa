const sequelize = require('../database/db_config');
const { DataTypes } = require('sequelize')

const Article = sequelize.define('article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});


module.exports = Article;