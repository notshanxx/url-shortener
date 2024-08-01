import SHORTURL_MODEL from "../models/shortUrl.js";

// get the index.js
export const getHome = async (req, res) => {
    const urlLists = await SHORTURL_MODEL.find();
    res.render("index", { shortUrls: urlLists });
  }