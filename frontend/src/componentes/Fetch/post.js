import axios from "axios";

// post(url, data):
// Si data es FormData, envía como multipart/form-data
// Si es objeto normal, envía como JSON
export async function post(url, data) {
    if (data instanceof FormData) {
        const res = await axios.post(url, data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } else {
        const res = await axios.post(url, data);
        return res.data;
    }
}
