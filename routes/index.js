const stockPrice = require("express").Router();
const axios = require("axios");
const StockPrice = require("../model/stockPrice");

stockPrice.get("/Stocks/search", async (req, res) => {
  const keyword = req.query.keyword;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const regexPattern = `.*${keyword}.*`;

  try {
    const countQuery = {
      $or: [
        { exchange_id: { $regex: regexPattern, $options: "i" } },
        { name: { $regex: regexPattern, $options: "i" } },
        { website: { $regex: regexPattern, $options: "i" } },
      ],
    };

    const totalCount = await StockPrice.countDocuments(countQuery);
    const totalPages = Math.ceil(totalCount / limit);

    const skip = (page - 1) * limit;

    const searchQuery = {
      ...countQuery,
    };

    const results = await StockPrice.find(searchQuery).skip(skip).limit(limit);

    res.json({
      results,
      currentPage: page,
      totalPages,
      currentData: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
stockPrice.get('/getAllStock', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page) || 1; // Page number, default to 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Number of results per page, default to 10 if not provided

    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete',
      params: {
        q: keyword || 'tesla',
        region: 'US',
      },
      headers: {
        'X-RapidAPI-Key': '487a1b6efdmsh4c6b9e259211317p18e476jsnd3e0a94313ff',
        'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      },
    };

    const response = await axios.request(options);

    if (response.data.quotes && response.data.quotes.length > 0) {
      const stockData = response.data.quotes[0];

      // Calculate the starting index based on the page and limit
      const startIndex = (page - 1) * limit;

      // Extract a slice of the data based on the pagination parameters
      const paginatedData = response.data.quotes.slice(startIndex, startIndex + limit);

      // Create a new response object with paginated data
      const paginatedResponse = {
        currentData: paginatedData,
        totalCount: response.data.count,
      };

      const filter = { symbol: stockData.score };
      const update = {
        name: stockData.shortname,
        price: stockData.score,
      };

      const updateOptions = { upsert: true, new: true, setDefaultsOnInsert: true };

      const updatedStock = await StockPrice.findOneAndUpdate(filter, update, updateOptions);
      
      res.json(paginatedResponse);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.response });
  }
});



module.exports = stockPrice;
