import { getElementOrThrow } from "./utils/dom.js";

export interface Page {
    templateId: string;
    onRender: () => void;
}

interface Router {
    addRoute(path: string, page: Page): void
}

export const router: Router = new class {
    private routes: { [key: string]: Page };

    public constructor() {
        this.routes = {};
        this.setupListeners();
    }

    public addRoute(path: string, page: Page): void {
        this.routes[path] = page;
    }

    private handleRouteChange(newRoute: string): void {
        const page = this.routes[newRoute] || notFoundPage;
        this.render(page);
    }

    private render(page: Page): void {
        const main = getElementOrThrow<HTMLDivElement>(document, "main");
        const template = getElementOrThrow<HTMLTemplateElement>(document, `#${page.templateId}`);
        const clone = document.importNode(template.content, true);

        main.innerHTML = '';
        main.appendChild(clone);
        page.onRender();
    }

    private setupListeners(): void {
        document.addEventListener('routeChanged', () => {
            const route = window.location.pathname;
            this.handleRouteChange(route);
        });

        window.addEventListener('popstate', () => {
            const route = window.location.pathname;
            this.handleRouteChange(route);
        });

        document.addEventListener('DOMContentLoaded', () => {
            const route = window.location.pathname;
            this.handleRouteChange(route);
        });
    }
}

export const navigateTo = (pageKey: string, url: string): void => {
    history.pushState({ page: pageKey }, '', url);
    const event = new Event('routeChanged');
    document.dispatchEvent(event);
};

const notFoundPage: Page = {
    templateId: 'page-not-found',
    onRender: () => {
        const homeButton = getElementOrThrow<HTMLButtonElement>(document, "#back-home");
        homeButton.addEventListener('click', () => navigateTo('home', "./"));
    }
}

router.addRoute('not-found/', notFoundPage);
