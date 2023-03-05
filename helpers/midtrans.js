const midtransClient = require("midtrans-client");
const midTransaction = (data, topup) => {
  // Create Snap API instance
  console.log();
  let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: false,
    serverKey: process.env.SERVER_KEY,
  });

  let parameter = {
    transaction_details: {
      order_id: `YOUR-ORDERID-${1000 + Math.floor(Math.random() * 777)}-${
        data.dataValues.username
      }`,
      gross_amount: topup,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: data.dataValues.fullName,
      email: data.dataValues.email,
      phone: data.dataValues.phone,
    },
  };
  let token = snap.createTransaction(parameter).then((transaction) => {
    // transaction token
    let transactionToken = transaction;
    return transactionToken;
  });
  return token;
};

module.exports = midTransaction;
