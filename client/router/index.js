import VueRouter from "vue-router";
import singleUser from "../src/components/singleUser.vue";
import MainPage from "../src/components/MainPage.vue";

export default new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: MainPage,
        },
        {
            path: "/user/:id",
            component: singleUser,
        },
    ],
});
