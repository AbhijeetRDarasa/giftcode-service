const axios = require("../plugin/axios");

const { reqToken, jsonError } = require("../library/helper");

const timeout = 10000;

const encourageDeposit = async (token, data) => {
  let result = {
    data: null,
  };
  try {
    result = await axios({
      method: "post",
      timeout,
      url: `${process.env.PROMOTION_URL}/invoice/event`,
      data,
      headers: reqToken(token),
    });
  } catch (error) {
    return jsonError(error);
  }
  return result.data;
};

module.exports = { encourageDeposit };
