import { productModal } from "./productModal.js";
import pagination from "./pagination.js";

// 選擇加入特定規則
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
// 讀取外部的資源
loadLocaleFromURL('./zh_TW.json');
// Activate the locale
configure({
    // 將語系切換為中文版
    generateMessage: localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});


const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'benson-db';

const app = Vue.createApp({
    data() {
        return {
            products: [],
            product: {},
            productId: '',
            cartData: {
                //如未先定義 carts，在讀取 cartData 之後讀不到carts資料，取 length會出錯
                carts: [],
            },
            form: {
                user: {
                    email: '',
                    name: '',
                    tel: '',
                    address: '',
                },
                message: ''
            },
            isLoadingItem: '',
            pagination: {},
        }
    },
    components: {
        productModal,
        pagination,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods: {
        // 驗證手機格式
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '手機號碼格式不正確，請輸入 09 開頭手機號'
        },
        // 取得產品資料
        // getProducts() {
        //     const url = `${apiUrl}/api/${apiPath}/products/all`;
        //     axios.get(url).then(res => {
        //         this.products = res.data.products;
        //     })
        // },
        getProducts(page = 1) { //參數預設值，page沒有值則帶入1
            //query 資料帶法為 /?page=${page}
            let url = `${apiUrl}/api/${apiPath}/products/?page=${page}`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        // 打開 modal
        openProductModal(id) {
            // this.productId = id;
            // 先執行 Modal getProduct 方法
            this.$refs.productModal.getProduct(id);
        },
        // 取得購物車資料
        getCart() {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.get(url).then(res => {
                this.cartData = res.data.data;
            })
        },
        // 加入購物車
        addToCart(id, qty = 1) {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            const data = {
                product_id: id,
                qty,
            }
            this.isLoadingItem = id;

            axios.post(url, { data }).then(res => {
                alert(res.data.message);
                this.getCart();
                this.isLoadingItem = '';
            }).catch(err => {
                alert(err.data.message);
            })
        },
        // 清空購物車
        clearAllCarts() {
            const url = `${apiUrl}/api/${apiPath}/carts`;
            axios.delete(url)
                .then(res => {
                    alert('已清空購物車');
                    this.getCart();
                })
                .catch(err => {
                    alert('購物車內無商品');
                })
        },
        // 刪除單一品項
        deleteCartItem(id) {
            const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
            this.isLoadingItem = id;
            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    this.getCart();
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        // 更新購物車
        updateCart(item) {
            const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
            const data = {
                product_id: item.id,
                qty: item.qty,
            }
            this.isLoadingItem = item.id;

            axios.put(url, { data }).then(res => {
                alert(res.data.message);
                this.getCart();
                this.isLoadingItem = '';
            }).catch(err => {
                alert(err.data.message);
            })
        },
        // 建立訂單
        createOrder() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form; // api 文件為物件 data:{} 
            axios.post(url, { data: order }).then(res => {
                alert(res.data.message);
                this.$refs.form.resetForm(); //送出表單後清空
                this.getCart();
            }).catch(err => {
                alert(err.data.message);
            })
        }
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
});

app.mount('#app');