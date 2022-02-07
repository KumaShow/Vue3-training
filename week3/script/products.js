import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
const path = 'benson-db';

const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
axios.defaults.headers.common['Authorization'] = token;

let productModal = null;
let delProductModal = null;

const app = createApp({
    data() {
        return {
            products: [],
            tempProduct: {
                imagesUrl: []
            },
            isNew: false,
        }

    },
    methods: {

        checkLogin() {
            let url = `${site}/api/user/check`;
            axios.post(url)
                .then((res) => {

                })
                .catch((err) => {
                    alert('未登入驗證');
                    window.location.replace('./login.html')
                })
        },
        // 取得產品資料
        getProducts() {
            let url = `${site}/api/${path}/admin/products`;
            axios.get(url)
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        openModal(status, product) {
            if (status === 'isNew') {
                this.tempProduct = {
                    imagesUrl: []
                }
                productModal.show();
                this.isNew = true;
            } else if (status === 'edit') {
                this.tempProduct = { ...product };
                productModal.show();
                this.isNew = false;
            } else if (status === 'delete') {
                delProductModal.show();
                this.tempProduct = { ...product };
            }
        },
        updateProduct() {
            let url = `${site}/api/${path}/admin/product`;
            let method = 'post';

            if (!this.isNew) {
                url = `${site}/api/${path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            // 依據api文件須回傳data物件格式
            axios[method](url, { data: this.tempProduct })
                .then((res) => {
                    // 新增成功後，重新獲得產品資料
                    this.getProducts();
                    productModal.hide();
                })
        },

        //刪除商品
        delProduct() {
            let url = `${site}/api/${path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then((res) => {
                    delProductModal.hide(); // 商品刪除後，關閉刪除確認畫面
                    this.getProducts(); // 重新取得產品資料
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        }
    },
    mounted() {
        this.checkLogin();
        this.getProducts();
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }
})

app.mount('#app');