/**
 * Created by administrator on 2019/3/20.
 */
import axios from 'axios';
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//基本配置
const Util = {
    // baseUtl:'http://localhost:3000/api/'
    baseUtl:'http://182.92.210.246:3000/api/'
};

//ajax 通用配置
Util.ajax = axios.create({
    baseURL:Util.baseUtl,
});


//添加响应拦截器
Util.ajax.interceptors.response.use(res => {
    return res.data;
});

export default Util;
