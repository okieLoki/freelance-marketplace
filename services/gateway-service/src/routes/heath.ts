import Health from '@gateway/controllers/health';
import { Router } from 'express'


class HealthRoutes {
    public router: Router;

    constructor() {
        this.router = Router()
    }

    public routes(): Router {
        this.router.get('/gateway-health', Health.prototype.healthController)
        return this.router
    }
}

const heathRoute: HealthRoutes = new HealthRoutes()

export { heathRoute }