const User = require('./User');
const Portfolio = require('./Portfolio');
const Portfolio_Coin_Entry = require('./Portfolio_Coin_Entry');
const Coin = require('./Coin');
const Challenge = require('./Challenge');
const Challenge_Coin_Data = require('./Challenge_Coin_Data');


User.hasMany(Portfolio, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Challenge.hasMany(Portfolio,{
    foreignKey: 'challenge_id',
    onDelete: 'CASCADE'
});

Challenge.hasMany(Challenge_Coin_Data, {
    foreignKey: 'challenge_id',
    onDelete: 'CASCADE'
});

Challenge_Coin_Data.belongsTo(Challenge,{
    foreignKey: 'challenge_id'
});

Portfolio.belongsTo(Challenge, {
    foreignKey: 'challnge_id'
});

Portfolio.belongsTo(User, {
  foreignKey: 'user_id'
});

Portfolio.hasMany(Portfolio_Coin_Entry, {
    foreignKey: 'portfolio_id',
    onDelete: 'CASCADE'
});

Portfolio_Coin_Entry.belongsTo(Portfolio, {
    foreignKey: 'portfolio_id'
});

Coin.hasMany(Portfolio_Coin_Entry, {
    foreignKey: 'coin_id',
    onDelete: 'CASCADE'
});

Portfolio_Coin_Entry.belongsTo(Coin, {
    foreignKey: 'coin_id'
});

Coin.hasMany(Challenge_Coin_Data, {
    foreignKey: 'coin_id',
    onDelete: 'CASCADE'
});

Challenge_Coin_Data.belongsTo(Coin, {
    foreignKey: 'coin_id'
});

module.exports = { User, Portfolio, Portfolio_Coin_Entry,
                   Coin, Challenge, Challenge_Coin_Data };
