import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';
import pagination from './components/pagination.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
const path = 'benson-db';

let productModal = null;
let delProductModal = null;

const app = createApp({
    components: {
        pagination,
    },
    data() {
        return {
            products: [],
            tempProduct: {
                imagesUrl: []
            },
            isNew: false,
            pagination: {},
        }
    },
    methods: {
        checkLogin() {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            let url = `${site}/api/user/check`;
            axios.post(url)
                .then(res => {
                })
                .catch(err => {
                    alert('未登入驗證');
                    window.location.replace('./login.html')
                })
        },
        // 取得產品資料
        getProducts(page = 1) { //參數預設值，page沒有值則帶入1
            //query 資料帶法為 /?page=${page}
            let url = `${site}/api/${path}/admin/products/?page=${page}`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                })
                .catch(err => {
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
    },
    mounted() {
        this.checkLogin();
        this.getProducts();

        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }
})

app.component('productModal', {
    props: ['tempProduct', 'isNew'],
    template: `#templateForProductModal`,
    methods: {
        // 當彈出視窗元件化後，把方法綁訂到元件內使用
        updateProduct() {
            let url = `${site}/api/${path}/admin/product`;
            let method = 'post';
            // 根據isNew決定要 post或是put api
            // 編輯的狀態
            if (!this.isNew) {
                url = `${site}/api/${path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](url, { data: this.tempProduct })
                .then(res => {
                    // 觸發外層方法getProducts
                    this.$emit('get-products')
                    productModal.hide();
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
    }
})

app.component('delProduct', {
    props: ['tempProduct'],
    template: `#templateForDelProduct`,
    methods: {
        delProduct() {
            let url = `${site}/api/${path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    this.hideModal();
                    this.$emit('get-products')
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        hideModal() {
            delProductModal.hide();
        }
    },
})

app.mount('#app');