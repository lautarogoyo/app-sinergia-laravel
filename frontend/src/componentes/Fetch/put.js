import axios from "axios";
export  function put(url, object) {
  return  axios.put(url, object)
    .then((response) => response.data);
}   