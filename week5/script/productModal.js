
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'benson-db';

const productModal = ({
    props: ['id'],
    template: '#userProductModal',
    data() {
        return {
            product: {},
            modal: {},
            qty: 1,
        }
    },
    // watch: {
    //     // 當 id 變動時觸發
    //     id() {
    //         this.getProduct();
    //     }
    // },
    methods: {
        openModal() {
            this.qty = 1;
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        },
        getProduct(id) {
            const url = `${apiUrl}/api/${apiPath}/product/${id}`;
            axios.get(url).then(res => {
                this.product = res.data.product;
                // 抓到產品資料後才顯示，避免打開時顯示上一個產品資料
                this.openModal()
            })
        },
        addToCart() {
            // 執行外層方法
            this.$emit('add-cart', this.id, this.qty);
            this.hideModal();
        }
    },
    mounted() {
        // ref="modal"
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
})

export {
    productModal,
}