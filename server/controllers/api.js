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
    //   Get the client_user_id by searching for the current user
    //   const user = await User.find(...);
    //   const clientUserId = user.id;
    const clientUserId = "user";
    const plaidRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: clientUserId,
      },
      client_name: "Plaid Test App",
      products: ["auth"],
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
    const publicToken = request.body.public_token;
    try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const accessToken = plaidResponse.data.access_token;
      response.json({ accessToken });
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
