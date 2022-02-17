let productModal = null;

export default {
    props: ['tempProduct'],
    template: ``,
    methods: {
        // 當彈出視窗元件化後，要把方法綁訂到元件內使用
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
                    // 觸發外層方法getProducts
                    this.$emit('get-products')
                    productModal.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
    },
}