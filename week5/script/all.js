// 選擇加入特定規則
VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    // 將語系切換為中文版
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'benson-db';

const app = Vue.createApp({
    data() {
        return {
            products: [],
            product: {},
            form: {
                user: {
                    email: '',
                    name: '',
                    tel: '',
                    address: '',
                },
                message: ''
            },
            cart: {},
        }
    },
    components: {
    },
    methods: {
        onSubmit() {
            console.log(this.user);
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '手機號碼格式不正確'
        },
        getProducts() {
            const url = `${apiUrl}/api/${apiPath}/products`;
            axios.get(url).then(res => {
                this.products = res.data.products;
            })
            console.log('getProducts');
        }
    },
    mounted() {
        this.getProducts();
    },
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');