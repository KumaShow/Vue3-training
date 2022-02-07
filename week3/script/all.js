import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點
const path = 'benson-db'; // 請加入個人 API Path



const app = createApp({
    data() {
        return {
            user: {
                username: '',
                password: ''
            },
        }
    },
    methods: {
        login() {
            // #2 發送 API 至遠端並登入（並儲存 Token）
            axios.post(`${url}/admin/signin`, this.user)
                // 成功的結果
                .then((res) => {
                    // console.log(res);
                    const { token, expired } = res.data;
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
                    // 登入後跳轉頁面
                    window.location.replace("./products.html");
                })
                // 失敗的結果
                .catch((err) => {
                    alert('登入失敗，請確認帳號密碼')
                })
        }
    },
})

app.mount('#app');