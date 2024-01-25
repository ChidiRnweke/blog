export const getElementOrThrow = <T extends Element>(source: Document | ShadowRoot | HTMLElement, selector: string): T => {
    const element = source.querySelector<T>(selector);
    if (!element) {
        const querySource = source instanceof Document ? "light DOM" : "Shadow Root"
        throw new Error(`Required element with selector "${selector}" was not found in ${querySource}.`);
    }
    return element;
}

export const getAttributeOrThrow = (source: Element, attributeName: string): string => {
    const attribute = source.getAttribute(attributeName);
    if (!attribute) {
        const querySource = source instanceof Document ? "light DOM" : "Shadow Root"
        throw new Error(`Required attribute with selector "${attributeName}" was not found in ${querySource}`);
    }
    return attribute;
}

export const getOptionalAttribute = (source: HTMLElement, name: string): string => {
    const value = source.getAttribute(name);
    return value ? `${name}="${value}"` : ""
}

export const getLocalStorageOrThrow = (key: string): string => {
    const value = localStorage.getItem(key);
    if (value === null) {
        throw new Error(`Required key ${key} was expected to be in local storage.`);
    }
    return value
}