const db = require("../models");

const createGiftCode = async (giftCode) => {
  const result = await db.GiftCode.create(giftCode);
  return result;
};

const findGiftCodeUSed = async (giftCodeUsedQuery) => {
  const result = await db.GiftCodeUsed.findOne(giftCodeUsedQuery);
  return result;
};

const findCountByParams = async (query) => {
  const result = await db.GiftCodeUsed.find(query).count();
  return result;
};

const createGiftCodeUsed = async (giftCodeUsed) => {
  const newGiftCodeUsed = await db.GiftCodeUsed.create(giftCodeUsed);
  return newGiftCodeUsed;
};

const findGiftCode = (giftCodeId) => {
  return db.GiftCode.find({ code: giftCodeId });
};

module.exports = {
  createGiftCode,
  createGiftCodeUsed,
  findGiftCode,
  findGiftCodeUSed,
  findCountByParams,
};
