import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import * as d3 from 'd3'
import { queue } from 'd3-queue'

import 'primevue/resources/primevue.min.css';
import chart from './components/chart.vue'
import HomeView from './views/HomeView.vue'
import "primeflex/primeflex.css";
import './assets/_theme.scss';


// Add Components
import Card from "primevue/card";
import Button from "primevue/button";
import Sidebar from "primevue/sidebar";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import SelectButton from "primevue/selectbutton";
import Toolbar from "primevue/toolbar";
import InputText from 'primevue/inputtext';
import Badge from 'primevue/badge';
import Message from 'primevue/message';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Divider from 'primevue/divider';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import Carousel from 'primevue/carousel';
import DataView from 'primevue/dataview';
import Paginator from 'primevue/paginator';
import Galleria from 'primevue/galleria';
 
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';



//import './assets/main.css'
const app = createApp(App)

app.use(router)

app.use(PrimeVue, { ripple: true })
app.component('d3', d3)
    .use(router)
    .component('Card', Card)
    .component('Button', Button)
    .component('SelectButton', SelectButton)
    .component('Sidebar', Sidebar)
    .component('Avatar', Avatar)
    .component('Menu', Menu)
    .component('Menubar', Menubar)
    .component('Toolbar', Toolbar)
    .component('InputText', InputText)
    .component('badge', Badge)
    .component('Message', Message)
    .component('Divider', Divider)
    .component('Splitter', Splitter)
    .component('SplitterPanel', SplitterPanel)
    .component('Galleria',Galleria)
    .component('pv-calendar', Calendar)
    .component('pv-dropdown', Dropdown)
    .component('pv-carousel', Carousel)
    .component('DataView', DataView)

app.component('chart', chart)
app.component('HomeView', HomeView)
app.mount('#app')
