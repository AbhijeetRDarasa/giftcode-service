const {
  createGiftCode,
  createGiftCodeUsed,
  findGiftCode,
  findGiftCodeUSed,
  findListOfUsage,
  findCountByParams,
} = require("../service/giftcode");

const moment = require("moment");

exports.routes = (app) => {
  app.post("/v1/createGift", async (req, res) => {
    console.log("createGift");
    const giftcodeConfig = req.body;
    const result = await createGiftCode(giftcodeConfig);
    res.send(result);
  });

  app.post("/v1/createGiftUsage", async (req, res) => {
    const code = req.body.code;
    const giftUsageData = req.body;
    const result = await createGiftCodeUsed(giftUsageData, code);
    res.send(result);
  });

  app.post("/v1/updateGift", async (req, res) => {
    const code = req.body.giftUsage.code;
    const giftCodeData = req.body.giftUsage.data;
    const result = await updateGiftCode(giftCodeData);
    res.send(result);
  });

  app.post("/v1/updateGiftUsage", async (req, res) => {
    const username = req.body.username;
    const result = await updateGiftCodeUsed(
      telegram_id,
      email,
      type,
      code,
      bot
    );
    res.send(result);
  });

  app.get("/v1/findGiftCode", async (req, res) => {
    const code = req.query.code;
    const ip = req.query.ip;
    const result = {
      status: "",
      code: 200,
      data: null,
    };
    const query = {
      code: code,
    };
    const data = await findGiftCode(query);
    result.status = "OK";
    result.data = data;
    res.send(result);
  });

  app.get("/v1/findGiftCodeUsageByQuery", async (req, res) => {
    const code = req.query.code;
    const ip = req.query.ip;
    const username = req.query.username;
    const result = {
      status: "",
      code: 200,
      data: null,
    };
    const query = {
      code: code,
      ip: ip,
      username: username,
    };
    const data = await findGiftCodeUSed(query);
    result.status = "OK";
    result.data = data;
    res.send(result);
  });

  app.get("/v1/findGiftUsageById", async (req, res) => {
    const code = req.query.code;
    const username = req.query.username;
    const ip = req.query.ip;

    const result = {
      status: "",
      code: 200,
      data: null,
    };
    const data = await findListOfUsage(code);
    const giftConfig = data[0];
    if (giftConfig) {
      const today = new Date();
      const isbefore = moment(today).isBefore(giftConfig.expired_at);
      const userQuery = {
        username: "",
        code: "",
        ip: "",
      };

      if (giftConfig.is_active && isbefore) {
        if (giftConfig.is_validate_ip) {
          userQuery.username = username;
          userQuery.code = code;
          userQuery.ip = ip;
          const found = await findGiftCodeUSed(userQuery);
          if (found) {
            result.status = "ERROR";
            result.message = "You have already used gift code from same ip ";
            return res.send(result);
          }
        }

        const query = {
          username: username,
          code: code,
        };
        const userCount = await findCountByParams(query);
        if (userCount.data >= giftConfig.times_on_user) {
          result.code = 200;
          result.status = "ERROR";
          result.message = "You have reached your limit of gift code usage";
          return res.send(result);
        }
        const giftCodequery = {
          code: code,
        };
        const giftUsageCount = await findCountByParams(giftCodequery);

        if (giftUsageCount > giftConfig.times) {
          result.code = 200;
          result.status = "ERROR";
          result.message =
            "Gift code usage limit has been reached, please get in touch with CS for more information.";
          return res.send(result);
        }
        result.status = "OK";
        result.data = giftConfig;
        return res.send(result);
      }
    } else {
      result.status = "ERROR";
      result.message =
        "Gift Code does not exist, please get in touch with CS for more information.";
      return res.send(result);
    }
  });

  app.get("/v1/getCountByParams", async (req, res) => {
    const code = req.query.code;
    const ip = req.query.ip;
    const username = req.query.username;
    const result = {
      status: "",
      code: 200,
      data: null,
    };
    const query = {
      code: code,
      ip: ip,
      username: username,
    };
    const count = await findCountByParams(query);
    result.status = "OK";
    result.data = count;
    res.send(result);
  });
};
