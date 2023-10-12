const axios = require("axios");

// Add a request interceptor
// axios.interceptors.request.use((config) => {
//     console.log(config);
// });

axios.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      console.debug(response.config);
    }
    return response;
  },
  (error) => {
    if (
      error != null &&
      (error.code === "ENETUNREACH" || error.code === "ECONNABORTED")
    ) {
      return {
        data: {
          code: 502,
          status: "SHOW_MESSAGE",
          message: "Không thể kết nối máy chủ, Vui lòng thử lại sau" + error,
        },
      };
    }
    if (error != null && error.response && error.response.data) {
      return {
        data: {
          code: error.response.data.code || 400,
          status: error.response.data.status || "SHOW_MESSAGE",
          message:
            error.response.data.message ||
            "Không thể kết nối máy chủ, Vui lòng thử lại sau",
        },
      };
    }
    console.log(`Axios error : ${JSON.stringify(error)}`);
    console.trace(error);
    return {
      data: {
        code: 520,
        status: "UNKNOWN_ERROR",
        message: "Lỗi chưa xác định",
      },
    };
  }
);
module.exports = axios;
