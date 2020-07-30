import Axios from 'axios';
const ip = '192.168.2.111';
const Api = Axios.create({
  baseURL: `${ip}:3333`,
});
export default Api;
