// Simple Express server for searching cases via portal.just.ro SOAP API
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import soap from "soap";

const app = express();
const PORT = 3001;
const WSDL_URL = "http://portalquery.just.ro/Query.asmx?wsdl";

const allowedOrigins = [
  "https://portaljust.netlify.app", // production
  "http://localhost:5173", // local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".netlify.app")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

// Search cases endpoint
app.post("/api/search-cases", async (req, res) => {
  const {
    numarDosar,
    obiectDosar,
    numeParte,
    institutie,
    dataStart,
    dataStop,
  } = req.body;
  try {
    const client = await soap.createClientAsync(WSDL_URL);
    const args = {
      numarDosar: numarDosar || null,
      obiectDosar: obiectDosar || null,
      numeParte: numeParte || null,
      institutie: institutie || null,
      dataStart: dataStart || null,
      dataStop: dataStop || null,
    };
    client.CautareDosare(args, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
