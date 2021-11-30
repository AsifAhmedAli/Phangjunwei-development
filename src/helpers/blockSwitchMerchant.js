const { ForbiddenError } = require("apollo-server-express");

module.exports = blockSwitchMerchant = async (id, models, user, status) => {
    if (!user) {
        throw new ForbiddenError("You are not authorized to perform this action");
    }

    if (user.role !== "Admin" && user.role !== "Superadmin") {
        throw new ForbiddenError("You are not authorized to perform this action");
    }

    try {
        const merchant = await models.Merchant.findOne({ where: { id: id } });

        if (!merchant) {
            throw new Error("Merchant does not exist")
        }

        // Block merchant
        await models.Merchant.update({
            blocked: status
        }, {
            where: { id: id }
        });

        // Disable all products
        const products = await models.Product.findAll({ where: { merchantId: id } });

        for (let i = 0; i < products.length; i++) {
            await models.Product.update({
                disabled: status
            }, {
                where: { id: products[i].id }
            });
        }

        return merchant;

    } catch (error) {
        throw new Error(error.message)
    }
}