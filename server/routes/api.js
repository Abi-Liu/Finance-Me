const router = require("express").Router();
const apiController = require('../controllers/api')

router.post("/create_link_token", apiController.createLinkToken)
router.post("/exchange_public_token", apiController.exchangePublicToken)
router.post("/auth", apiController.auth)
router.get('/api/transactions', apiController.transactions)

module.exports = router;
