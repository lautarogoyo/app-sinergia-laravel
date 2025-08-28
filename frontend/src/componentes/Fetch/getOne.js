import axios from "axios";
export function getOne(url, objectKey) {
  return axios.get(url)
    .then((response) => response.data[objectKey]);
}   