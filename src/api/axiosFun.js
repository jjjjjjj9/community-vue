import axios from 'axios';
axios.defaults.baseURL = "http://127.0.0.1:15085"

// 通用公用方法
const req = (method, url, params) => {
    return axios({
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        data: params,

    }).then(res => res.data);
};

export {
    req
}
