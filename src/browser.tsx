import { BUILD_TS, APP_VERSION, BUILD_DT } from './build_info';

import ReactDOM from 'react-dom';


import router from "./router";

// import { createBrowserHistory } from 'history';

// import router from "./router";

// const newHistory = createBrowserHistory();

declare global {
    interface Window {
        my_string: any;
    }
}


console.log(`Browser script entry point tsx: ${BUILD_TS} ${APP_VERSION} ${BUILD_DT}`);

console.log(router);

console.log(window.location);

router.resolve({ pathname: window.location.pathname }).then((component: JSX.Element) => {
    const MOUNT_NODE = window.document.getElementById('app');
    ReactDOM.hydrate(component, MOUNT_NODE);
})


// Note that a dynamic `import` statement here is required due to
// webpack/webpack#6615, but in theory `import { greet } from './pkg/hello_world';`
// will work here one day as well!

const rust_module = import('../wasm_app_dist/');

rust_module.then((m) => {
    m.log_work();

    let my_string = m.hello_world();

    console.log(my_string);

    window.my_string = my_string;

}).catch(console.error);
