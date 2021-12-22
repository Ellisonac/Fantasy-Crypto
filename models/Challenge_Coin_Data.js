const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Challenge_Coin_Data extends Model {
  //Create functions if needed
}

Challenge_Coin_Data.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    challenge_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'challenge',
            key: 'id',
        },
    },
    coin_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'coin',
            key: 'id',
        },
    },
    start_value:{
        type: DataTypes.INTEGER
    },
    end_value:{
        type: DataTypes.INTEGER
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'challenge_coin_data',
  }
);

module.exports = Challenge_Coin_Data;