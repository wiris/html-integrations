import { createApp } from "vue";
import App from "./App.vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import "./assets/css/main.css";

createApp(App).use(CKEditor).mount("#editor");
