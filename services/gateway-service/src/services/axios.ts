import axios from "axios";
import jwt from "jsonwebtoken";
import { config } from "@gateway/config";

class AxiosService {
    public axios: ReturnType<typeof axios.create>;

    constructor(baseURL: string, serviceName: string) {
        this.axios = this.axiosCreateInstance(baseURL, serviceName)
    }

    public axiosCreateInstance(baseURL: string, serviceName?: string): ReturnType<typeof axios.create> {
        let requestGatewayToken = ''

        if (serviceName) {
            requestGatewayToken = jwt.sign(
                {
                    id: serviceName
                },
                config.GATEWAY_JWT_TOKEN
            )
        }

        const instance: ReturnType<typeof axios.create> = axios.create({
            baseURL: baseURL,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                gatewayToken: requestGatewayToken
            },
            withCredentials: true
        })

        return instance
    }
}

export { AxiosService }