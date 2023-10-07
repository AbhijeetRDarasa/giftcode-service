const {  createGiftCode, createGiftCodeUsed, updateGiftCode, updateGiftCodeUsed, findGiftCode, findGiftCodeUSed,findListOfUsage} = require('../service/giftcode');


exports.routes = (app) => {

  app.post("/v1/createGift", async (req, res) => {
    console.log("createGift");
    const giftcodeConfig = req.body
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
    const username = req.body.username
    const result = await updateGiftCodeUsed(telegram_id, email, type, code, bot);
    res.send(result);
  });

  app.get("/v1/findGiftCode", async (req, res) => {
    const code = req.query.code;
    const ip = req.query.ip;
    const result  = {
      status: '',
      code:200,
      data: null
    }
    const query  = {
      code: code
    }
    const data = await findGiftCode(query);
    result.status = "OK";
    result.data = data;    
    res.send(result);
  });


  app.get("/v1/findGiftUsageById", async (req,res) => {
    const usageArray = req.query.usageArray;
    const result  = {
      status: '',
      code:200,
      data: null
    }
    const data = await findListOfUsage(usageArray);
    result.status = "OK"
    result.data = data[0];
    return res.send(result)
  })
};