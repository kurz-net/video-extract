import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.static("files"))

const port = process.env.API_PORT || 5000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`)
})
