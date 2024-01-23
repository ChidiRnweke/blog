import { router, Page } from "../router.js"

export const homePage: Page = {
    templateId: "home",
    onRender: () => { }
    //   example usage:
    //     loginButton.addEventListener('click', () => navigateTo('login', '/login'));

    //     registerButton.addEventListener('click', () => navigateTo('register', '/register'));
    // }
}

router.addRoute('/', homePage);
