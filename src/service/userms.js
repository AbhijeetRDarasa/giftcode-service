const axios = require("../plugin/axios");

const { reqToken, jsonError } = require("../library/helper");

const timeout = 10000;

const getUser = async (id, token) => {
  let result = {
    data: null,
  };
  try {
    result = await axios({
      method: "get",
      timeout,
      url: `${process.env.USER_URL}/user/${id}`,
      headers: reqToken(token),
    });
  } catch (error) {
    return jsonError(error);
  }
  return result.data;
};

module.exports = { getUser };
