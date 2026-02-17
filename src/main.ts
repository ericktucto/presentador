import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import icons from './icons'
import { createI18n } from 'vue-i18n'
import { messages } from './messages'

createApp(App)
    .use(createI18n({
        legacy: false,
        locale: 'es',
        fallbackLocale: 'en',
        messages
    }))
    .use(createPinia())
    .component('v-icon', icons)
    .mount('#app')
