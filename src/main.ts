import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import icons from './icons'


createApp(App)
    .use(createPinia())
    .component('v-icon', icons)
    .mount('#app')
