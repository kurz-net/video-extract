import { prisma } from "@vx/prisma/client"
import { app } from "./api"
import { startDownloader } from "./download"

async function main() {
    const port = process.env.API_PORT || 5000
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}/`)
    })

    await startDownloader()
}

main()
    .catch(e => {
        console.log("Error:", e)
        process.exit(1);
    })
        .finally(async () => {
        await prisma.$disconnect()
    })
