const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Portfolio extends Model {
  //Create functions if needed
}

Portfolio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id',
        },
    },
    challenge_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'challenge',
            key: 'id',
        },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'portfolio',
  }
);

module.exports = Portfolio;