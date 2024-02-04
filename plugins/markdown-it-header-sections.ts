import type { PluginSimple, Token } from 'markdown-it';

function last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

function headingLevel(header: string): number {
    return parseInt(header.slice(1), 10);
}

interface Section {
    level: number;
    nestedLevel: number;
}

const headerSections: PluginSimple = (md) => {
    function addSections(state: any): void {
        let tokens: Token[] = [];
        let sections: Section[] = [];
        let nestedLevel = 0;

        function openSection(attrs?: [string, string][]): Token {
            let t = new state.Token('section_open', 'section', 1);
            t.block = true;
            t.attrs = attrs?.slice() ?? [];
            return t;
        }

        function closeSection(): Token {
            return new state.Token('section_close', 'section', -1);
        }

        function closeSectionsToCurrentLevel(level: number): void {
            while (last(sections) && level <= last(sections)!.level) {
                sections.pop();
                tokens.push(closeSection());
            }
        }

        for (const token of state.tokens) {
            nestedLevel += token.nesting;

            if (token.type === 'heading_open') {
                const level = headingLevel(token.tag);

                if (last(sections) && level <= last(sections)!.level) {
                    closeSectionsToCurrentLevel(level);
                }

                if (nestedLevel === 0 || !last(sections) || level > last(sections)!.level) {
                    tokens.push(openSection(token.attrs as [string, string][]));
                    sections.push({ level, nestedLevel });
                }

                const idIndex = token.attrIndex('id');
                if (idIndex !== -1) {
                    token.attrs!.splice(idIndex, 1);
                }
            }

            tokens.push(token);
        }

        closeSectionsToCurrentLevel(0);

        state.tokens = tokens;
    }

    md.core.ruler.push('header_sections', addSections);
};

export default headerSections;
