const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Portfolio_Coin_Entry extends Model {
  //Create functions if needed
}

Portfolio_Coin_Entry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    coin_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'coin',
            key: 'id',
        },
    },
    portfolio_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'portfolio',
            key: 'id',
        },
    },
    amount:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'portfolio_coin_entry',
  }
);

module.exports = Portfolio_Coin_Entry;