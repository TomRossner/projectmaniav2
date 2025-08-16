import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL as string;
axios.defaults.withCredentials = true;

export const uploadImageToS3 = async (imgUrl: string, fileName: string, contentType: string) => {
    return await axios.post(`/images`, {imgUrl, fileName, contentType});
}
