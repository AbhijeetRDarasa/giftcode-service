const reqToken = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };
  headers[process.env.TOKEN] = token;
  return headers;
};

const jsonError = (error) => ({
  code: 502,
  status: "ERROR",
  message: error,
});

module.exports = { reqToken, jsonError };
