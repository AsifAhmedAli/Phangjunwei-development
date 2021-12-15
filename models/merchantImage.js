'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MerchantImages extends Model {

        static associate(models) {
            // define association here
            MerchantImages.belongsTo(models.Merchant, { foreignKey: 'merchantId' });
        }
    };
    MerchantImages.init({
        collectionImg: DataTypes.STRING,
        bannerImg: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'MerchantImages',
    });
    return MerchantImages;
};