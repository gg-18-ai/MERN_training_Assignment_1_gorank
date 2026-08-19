const policies = require("../config/policies");
const { ProductModel } = require("../model");

/**
 * ABAC (Attribute-Based Access Control) Middleware
 * Usage: abacMiddleware("product:update")
 */
const abacMiddleware = (action) => async (req, res, next) => {
    try {
        const rules = policies[action];
        if (!rules) {
            return res.status(400).json({
                message: "Action policy not found",
            });






        }

        let product = null;
        if (req.params.id) {
            product = await ProductModel.findById(req.params.id);
        }

        const attributesObject = {
            user: req.user,
            product: product,
        };

        // Check if at least one policy rule passes (OR logic)
        const isAllowed = rules.some((rule) => rule(attributesObject));

        if (!isAllowed) {
            return res.status(403).json({
                message: "you are not authorized",
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = abacMiddleware;