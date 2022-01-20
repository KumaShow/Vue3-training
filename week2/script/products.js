import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點
const path = 'benson-db'; // 請加入個人 API Path

const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
axios.defaults.headers.common['Authorization'] = token;

const app = createApp({
    data() {
        return {
            products: {
            },
            detail: {}
        }

    },
    methods: {
        checkLogin(params) {
            axios.post(`${url}/api/user/check`)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.dir(err);
                    // 如果未登入驗證，會跳轉到登入頁面
                    alert('未登入驗證');
                    window.location.replace('./login.html')
                })
        },
        getProducts() {
            axios.get(`${url}/api/${path}/admin/products`)
                .then((res) => {
                    // console.log(res.data);
                    this.products = res.data.products;
                })
                .catch((err) => {
                    console.dir(err);
                })
        }
    },
    created() {
        this.checkLogin();
        this.getProducts();
    }
})

app.mount('#app');