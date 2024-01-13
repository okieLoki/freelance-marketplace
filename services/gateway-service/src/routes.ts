import { Application } from "express"
import { heathRoute } from "@gateway/routes/heath"

const appRoutes = (app: Application) => {
    app.use('/', heathRoute.routes())
}

export { appRoutes }