const express = require("express");
const router = express.Router();

const processHierarchy = require("../utils/hierarchyProcessor");

router.post("/", (req, res) => {
    const { data } = req.body;

    const result = processHierarchy(data);

    res.json(result);
});

module.exports = router;