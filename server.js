const express = require("express");
const cors = require("cors");

const bfhlRoute = require("./routes/bfhl");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/bfhl", bfhlRoute);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});