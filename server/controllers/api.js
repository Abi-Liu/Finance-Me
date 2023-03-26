const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const User = require("../models/User");
const Account = require("../models/Account");
const moment = require("moment");

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

module.exports = {
  createLinkToken: async (request, response) => {
    //   Get the client_user_id by searching for the current user);
    const clientUserId = request.body.id;
    const plaidRequest = {
      user: {
        client_user_id: clientUserId,
      },
      client_name: "Plaid Test App",
      products: ["transactions", "auth"],
      language: "en",
      redirect_uri: "http://localhost:5173/",
      country_codes: ["US"],
    };
    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(
        plaidRequest
      );
      response.json(createTokenResponse.data);
    } catch (error) {
      response.status(500).send("failure");
      // handle error
    }
  },
  exchangePublicToken: async (request, response) => {
    const { public_token, id } = request.body;
    const { name, institution_id } = request.body.metadata.institution;
    try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
        public_token: public_token,
      });
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const { access_token, item_id } = plaidResponse.data;

      let account = await Account.findOne({
        userId: id,
        institutionId: institution_id,
      });
      if (account) {
        console.log("Account already exists");
      } else {
        account = await Account.create({
          userId: id,
          accessToken: access_token,
          itemId: item_id,
          institutionId: institution_id,
          institutionName: name,
        });
      }
      response.json(account);
    } catch (error) {
      response.status(500).send("failed");
    }
  },
  deleteAccount: async (request, response) => {
    try {
      await Account.remove({ _id: request.params.id });
      response.json({ message: "Successfully deleted" });
    } catch (err) {
      console.log(err);
      response.status(500).json({ message: err });
    }
  },
  getAccounts: async (request, response) => {
    try {
      const accounts = await Account.find({ userId: request.params.id });
      response.json(accounts);
    } catch (err) {
      response.status(500).json({ message: err });
    }
  },
  auth: async (request, response) => {
    try {
      const access_token = request.body.access_token;
      const plaidRequest = {
        access_token: access_token,
      };
      const plaidResponse = await plaidClient.authGet(plaidRequest);
      response.json(plaidResponse.data);
    } catch (e) {
      response.status(500).send("failed");
    }
  },
  transactions: async (request, response) => {
    try {
      const now = moment();
      const today = now.format("YYYY-MM-DD");
      const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");
      let transactions = [];
      const items = request.body.account;
      items.forEach((item) => {
        let accessToken = item.accessToken;
        let institutionName = item.institutionName;
        const req = {
          access_token: accessToken,
          start_date: thirtyDaysAgo,
          end_date: today,
        };
        plaidClient.transactionsGet(req).then((res) => {
          // console.log(res.data.transactions[0]);
          // transactions.push({
          //   accountName: institutionName,
          //   transactions: res.data.transactions,
          // });
        });
      });
      response.json({ message: "transactions" });
    } catch (err) {
      response.status(500).json({ message: "Could not fetch transaction" });
    }
  },
};
