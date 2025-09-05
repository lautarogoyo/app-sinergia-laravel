import axios from "axios";

export function put(url, data, isFormData = false) {
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    return axios.post(url, data, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then((response) => response.data);
  } else {
    return axios.put(url, data)
      .then((response) => response.data);
  }
}

export function del(url) {
  return axios.delete(url).then((response) => response.data);
}
