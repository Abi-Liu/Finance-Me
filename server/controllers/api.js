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
      client_name: "FinanceMe",
      products: ["transactions"],
      language: "en",
      redirect_uri: "https://finance-me.netlify.app/",
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
      await Account.deleteOne({ _id: request.params.id });
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
  transactions: async (request, response) => {
    try {
      const now = moment();
      const today = now.format("YYYY-MM-DD");
      const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");
      let transactions = [];
      const items = request.body.account;
      const requests = items.map(async (item) => {
        let accessToken = item.accessToken;
        let institutionName = item.institutionName;
        const req = {
          access_token: accessToken,
          start_date: thirtyDaysAgo,
          end_date: today,
        };
        const res = await plaidClient.transactionsGet(req);
        transactions.push({
          accountName: institutionName,
          transactions: res.data.transactions,
          totalTransactions: res.data.total_transactions,
        });
      });
      // requests is an array of promises. Wait for all of them to complete:
      await Promise.all(requests);
      response.json(transactions);
      // transactions is now full.

      // items.forEach((item) => {
      //   let accessToken = item.accessToken;
      //   let institutionName = item.institutionName;
      //   const req = {
      //     access_token: accessToken,
      //     start_date: thirtyDaysAgo,
      //     end_date: today,
      //   };
      //   plaidClient.transactionsGet(req).then((res) => {
      //     transactions.push({
      //       accountName: institutionName,
      //       transactions: res.data.transactions,
      //     });
      //     if (transactions.length === items.length) {
      //       response.json(transactions);
      //     }
      //   });
      // });
    } catch (err) {
      response.status(500).json({ message: "Could not fetch transaction" });
    }
  },
  balance: async (request, response) => {
    try {
      const items = request.body.account;
      let accounts = [];
      const requests = items.map(async (item) => {
        let { _id, accessToken, institutionName } = item;
        const req = {
          access_token: accessToken,
        };
        const res = await plaidClient.accountsBalanceGet(req);
        accounts.push({
          id: _id,
          bank: institutionName,
          accountName: res.data.accounts[0].name,
          balance: res.data.accounts[0].balances,
          type: res.data.accounts[0].type,
        });
      });
      await Promise.all(requests);

      response.json(accounts);
    } catch (err) {
      response.status(500).json({ message: "Failed to get balance" });
    }
  },
};
