import axios from "axios";
import 'dotenv/config';

const env = process.env

export const api = axios.create({
    baseURL: env.API_URL
})