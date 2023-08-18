require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "https://moonshot-product-list-client.vercel.app",
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.post("/get-token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://devcore02.cimet.io/v1/generate-token",
      {},
      {
        headers: {
          "Api-key": process.env.DATA_API_KEY,
        },
      }
    );
    const token = response.data.data.token;

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

app.post("/get-products", async (req, res) => {
  const { token } = req.body;

  try {
    const response = await axios.post(
      "https://devcore02.cimet.io/v1/plan-list",
      {
        session_id: process.env.DATA_SESSION_ID,
      },
      {
        headers: {
          "Api-key": process.env.DATA_API_KEY,
          "Auth-token": token,
        },
      }
    );

    const products = response.data;

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
