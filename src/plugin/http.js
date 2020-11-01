import axios from 'axios'
//插件模块
const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        return response.data;
    }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
    // 4. 添加实例方法
    Vue.prototype.$http = axios
}
export default MyHttpServer