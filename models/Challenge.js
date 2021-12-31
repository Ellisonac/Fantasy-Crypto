const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Challenge extends Model {
  //Create functions if needed
}

Challenge.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    capital:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time_start: {
        type: DataTypes.DATE
    },
    time_end: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.STRING
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'challenge',
  }
);

module.exports = Challenge;