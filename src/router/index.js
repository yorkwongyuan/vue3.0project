import Vue from 'vue';
import Router from 'vue-router';
// import Law from './laws'
Vue.use(Router);
let routes = [];
const routerContext = require.context('./', true, /index\.js$/)

routerContext.keys().forEach(route => {
    // 排除自己
    if(route.startsWith('./index')){
        return;
    }
    const routerModule = routerContext(route)
    routes = [...routes,...(routerModule.default || routerModule)];

});


export default new Router({
    base: process.env.BASE_URL,
    routes:routes
});

