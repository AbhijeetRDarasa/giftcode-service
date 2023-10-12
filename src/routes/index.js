const {
  createGiftCode,
  createGiftCodeUsed,
  findGiftCodeUSed,
  findGiftCode,
  findCountByParams,
} = require("../service/giftcode");

const userms = require("../service/userms");
const { encourageDeposit } = require("../service/promotion");

const moment = require("moment");

exports.routes = (app) => {
  app.post("/v1/createGift", async (req, res) => {
    console.log("createGift");
    const giftcodeConfig = req.body;
    const result = await createGiftCode(giftcodeConfig);
    res.send(result);
  });

  app.get("/v1/findGiftUsageById", async (req, res) => {
    const code = req.query.code;
    const username = req.query.username;
    const ip = req.query.ip;
    const token = req.headers["x-token"];

    const userId = req.query.userId;

    const result = {
      status: "",
      code: 200,
    };

    const resultUser = await userms.getUser(userId, token);

    if (resultUser && resultUser.status !== "OK") {
      result.code = 200;
      result.status = "ERROR";
      result.message = "Unable to fetch user information";
      res.send(result);
      return;
    }

    const giftConfig = await validate(code, username, ip, result);

    if (giftConfig && giftConfig.status !== "OK") {
      result.message = giftConfig.message;
      res.send(result);
      return;
    } else {
      const str1 = giftConfig.data.aff_id;
      const str2 = resultUser.data[0].aff_id;
      if (str1.trim().toUpperCase() !== str2.trim().toUpperCase()) {
        result.code = 200;
        result.status = "ERROR";
        result.data = "";
        result.message =
          "You are not associated with any campaign , please get in touch with CS for more information.";
        res.send(result);
        return;
      }
      const dataDepositQuery = {
        amount: giftConfig.data.amount,
        username,
        method: giftConfig.data.aff_id,
        rolling: giftConfig.data.rolling,
      };
      const rs2 = await encourageDeposit(token, dataDepositQuery);
      if (rs2 && rs2.status === "OK") {
        const giftcodeusage = {
          code: code,
          username: username,
          ip: ip,
          amount: giftConfig.data.amount,
          brand: giftConfig.data.brand,
        };

        const data = await createGiftCodeUsed(giftcodeusage);

        if (!data) {
          result.code = 200;
          result.status = "ERROR";
          result.data = "";
          result.message =
            "Unable to save usage data, please get in touch with CS for more information.";
          res.send(result);
          return;
        }
        result.code = 200;
        result.status = "OK";
        result.data = "";
        result.message = "Deposited Successfully and Gift usage created .";
        res.send(result);
        return;
      }
      result.code = 200;
      result.status = rs2.status;
      result.message = rs2.message;
      result.data = "";
      res.send(result);
      return;
    }
  });

  const validate = async (code, username, ip, result) => {
    const data = await findGiftCode(code);
    const giftConfig = data[0];

    if (giftConfig) {
      const today = new Date();
      const isbefore = moment(today).isBefore(giftConfig.expired_at);
      const userQuery = {
        ip: "",
      };
      if (giftConfig.is_active && isbefore) {
        if (giftConfig.is_validate_ip) {
          userQuery.ip = ip;
          const found = await findGiftCodeUSed(userQuery);
          if (found) {
            result.status = "ERROR";
            result.message = "You have already used gift code from same ip ";
            return result;
          }
        }
        const query = {
          username: username,
          code: code,
        };
        const userCount = await findCountByParams(query);
        if (userCount >= giftConfig.times_on_user) {
          result.code = 200;
          result.status = "ERROR";
          result.message = "You have reached your limit of gift code usage";
          return result;
        }
        const giftCodequery = {
          code: code,
        };
        const giftUsageCount = await findCountByParams(giftCodequery);
        if (giftUsageCount >= giftConfig.times) {
          result.code = 200;
          result.status = "ERROR";
          result.message =
            "Gift code usage limit has been reached, please get in touch with CS for more information.";
          return result;
        } else {
          result.status = "OK";
          result.data = giftConfig;
          return result;
        }
      } else {
        result.status = "ERROR";
        result.message = "Gift Code either Expired or In Active";
        return result;
      }
    } else {
      result.status = "ERROR";
      result.message =
        "Gift Code does not exist, please get in touch with CS for more information.";
      return result;
    }
  };
};
