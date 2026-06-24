const express = require("express")
const app = express();
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.json({ msg: "Hello Github actions from Mayra_theCutiee_" })
});
app.listen(PORT, () => {
    console.log(`Server is running on the port no ${PORT}`)
})