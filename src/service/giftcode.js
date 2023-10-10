const db = require("../models");

const createGiftCode = async (giftCode) => {
  const result = await db.GiftCode.create(giftCode);
  return result;
};

const findGiftCode = async (giftCodeQuery) => {
  const data = {
    code: giftCodeQuery.code,
  };
  const result = await db.GiftCode.findOne(data);
  return result;
};

const findGiftCodeUSed = async (giftCodeUsedQuery) => {
  const result = await db.GiftCodeUsed.findOne(giftCodeUsedQuery);
  return result;
};

const findCountByParams = async (query) => {
  const result = await db.GiftCode.find(query).count();
  return result;
};

const createGiftCodeUsed = async (giftCodeUsed, giftCode) => {
  const giftdata = await db.GiftCode.findOne({ code: giftCode });
  if (giftdata != null) {
    const newGiftCodeUsed = await db.GiftCodeUsed.create(giftCodeUsed);
    //await addGiftCodeUsedToGiftCode(newGiftCodeUsed._id, giftdata);
    //await addGiftCodeToGiftCodeUsed(giftdata._id, newGiftCodeUsed);
    return newGiftCodeUsed;
  } else {
    return giftdata;
  }
};

const addGiftCodeUsedToGiftCode = (giftCodeId, giftCodeUsed) => {
  return db.GiftCodeUsed.findByIdAndUpdate(
    giftCodeId,
    { $push: { giftcodes: giftCodeUsed._id } },
    { new: true, useFindAndModify: false }
  );
};

const addGiftCodeToGiftCodeUsed = (giftCodeUsedId, giftCode) => {
  return db.GiftCode.findByIdAndUpdate(
    giftCodeUsedId,
    { $push: { giftcode_usages: giftCode._id } },
    { new: true, useFindAndModify: false }
  );
};

const findListOfUsage = (giftCodeId) => {
  //return db.GiftCode.find({code:giftCodeId}).populate("giftcode_usages", "-_id -__v -giftcodes");
  return db.GiftCode.find({ code: giftCodeId });
};

module.exports = {
  createGiftCode,
  createGiftCodeUsed,
  findGiftCode,
  findGiftCodeUSed,
  findListOfUsage,
  findCountByParams,
};
