const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'benson-db';

const app = Vue.createApp({
    data() {
        return {
            product: {}
        }
    },
    methods: {
        getProduct() {
            const url = `${apiUrl}/api/${apiPath}/product/${id}`;
            axios.get(url).then(res => {
                this.product = res.data.product;
            })
        }
    },
    mounted() {

    },
})

app.mount('#app');