const correctRoute = require("./spellchecker.routes")

const mountRoutes = (app)=>{
    app.use("/spellcheck" , correctRoute)
}

module.exports = mountRoutes