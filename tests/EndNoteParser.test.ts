import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { endNoteParser } from '../plugins/endNoteParser';

vi.mock('node-fetch', () => ({
    default: vi.fn((url: RequestInfo | URL) => {
        if (url === "https://example.com/page1") {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve('<!DOCTYPE html><html><head><title>Example Page 1</title></head><body></body></html>'),
            });
        }
        return Promise.reject(new Error('Fetch error'));
    })
}))

describe('EndNotePlugin', () => {
    let document: Document;

    beforeEach(() => {
        const dom = new JSDOM(`<html><body>
            <article>
                <a href="https://example.com/page1">Page 1</a>
                <a href="https://example.com/page2">Page 2</a>
            </article>
        </body></html>`, {
            url: "http://localhost",
        });
        document = dom.window.document;
    });

    it('replaces links with end-note elements', async () => {
        await endNoteParser(document);
        const endNotes = document.querySelectorAll('end-note');
        expect(endNotes.length).toBe(2);
    });

    it('appends an ordered list for references at the end', async () => {
        await endNoteParser(document);
        const referenceList = document.querySelector('ol');
        expect(referenceList).toBeDefined();
    });

    it('correctly populates reference list items', async () => {
        await endNoteParser(document);
        const items = document.querySelectorAll('ol li');
        expect(items.length).toBe(2);
    });

    it('fetches and displays the correct title for the first link', async () => {
        await endNoteParser(document);
        const items = document.querySelectorAll('ol li');
        expect(items[0].textContent).toContain("Example Page 1");
    });

    it('displays an error message for unreachable links', async () => {
        await endNoteParser(document);
        const items = document.querySelectorAll('ol li');
        expect(items[1].textContent).toContain("Title unavailable 🥹");
    });
});