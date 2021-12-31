const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Coin extends Model {
  //Create functions if needed
}

Coin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
    },
    ticker_symbol:{
        type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'coin',
  }
);

module.exports = Coin;