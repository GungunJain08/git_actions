const express = require("express")
const app = express();
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.json({ msg: "Hello Github actions v1" })
});
app.listen(PORT, () => {
    console.log(`Server is running on the port no ${PORT}`)
})