import SHORTURL_MODEL from "../models/shortUrl.js";

// GET short the url of shorturl then redirect to the full url
// app.get("/:shortUrl", redirectShortUrl);
export const redirectShortUrl = async (req, res) => {
  const shortUrl = await SHORTURL_MODEL.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) {
    return res.sendStatus(404);
  }
  shortUrl.clicks++;
  shortUrl.save();

  await res.redirect(shortUrl.full);
};

// POST or create in /shortUrls
// app.post("/shortUrls", createShortUrl);

export const createShortUrl = async (req, res) => {
  await SHORTURL_MODEL.create({
    full: req.body.fullUrl,
  });

  res.redirect("/");
};

// delete url Post in/:id
// app.post("/:id", deleteUrl);

export const deleteUrl = async (req, res) => {
  const id = req.params.id;
  const deleteAction = await SHORTURL_MODEL.findOneAndDelete({ _id: id });
  if (deleteAction == null) return res.sendStatus(404);

  res.redirect("/");
};
