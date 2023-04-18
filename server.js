import express from "express";
import cors from "cors";
import "./config.js";
const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.static("client"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "client/index.html");
});

app.listen(PORT, () =>
  console.log(`server is running http://localhost${PORT}`)
);
