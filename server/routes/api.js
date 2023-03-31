const router = require("express").Router();
const apiController = require("../controllers/api");

router.post("/create_link_token", apiController.createLinkToken);
router.post("/exchange_public_token", apiController.exchangePublicToken);
router.post("/transactions", apiController.transactions);
router.delete("/account/:id", apiController.deleteAccount);
router.get("/accounts/:id", apiController.getAccounts);
router.post("/balance", apiController.balance);

module.exports = router;
