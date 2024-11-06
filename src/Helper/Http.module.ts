import axios from "axios";
import { baseUrl } from "../Constant/global.constant";

const HttpModule = axios.create({
    baseURL: baseUrl,
});

export default HttpModule;