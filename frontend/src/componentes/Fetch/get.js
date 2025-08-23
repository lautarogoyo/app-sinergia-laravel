import axios from "axios";
export function getData(url, objectKey) {
  return axios.get(url)
    .then((response) => response.data[objectKey]);
}   