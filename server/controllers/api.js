const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const User = require("../models/User");

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
    try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
        public_token: public_token,
      });
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const { access_token, item_id } = plaidResponse.data;
      console.log("ran");
      await User.findByIdAndUpdate(id, {
        $push: {
          items: {
            item_id: item_id,
            access_token: access_token,
          },
        },
      });
      res.status(200).json({ message: "Item Linked" });
    } catch (error) {
      response.status(500).send("failed");
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
      // Set cursor to empty to receive all historical updates
      let cursor = null;
      // New transaction updates since "cursor"
      let added = [];
      let modified = [];
      // Removed transaction ids
      let removed = [];
      let hasMore = true;
      // Iterate through each page of new transaction updates for item
      while (hasMore) {
        const request = {
          access_token: ACCESS_TOKEN,
          cursor: cursor,
        };
        const response = await client.transactionsSync(request);
        const data = response.data;
        // Add this page of results
        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;
        // Update cursor to the next cursor
        cursor = data.next_cursor;
      }
      const compareTxnsByDateAscending = (a, b) =>
        (a.date > b.date) - (a.date < b.date);
      // Return the 8 most recent transactions
      const recently_added = [...added]
        .sort(compareTxnsByDateAscending)
        .slice(-8);
      response.json({ latest_transactions: recently_added });
    } catch (err) {
      console.error(err);
    }
  },
};
