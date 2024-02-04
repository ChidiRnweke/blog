# Blog

## Features Overview

### The Accidental SSG 🛠

Through a series of experiments with Vite, I made an SSG (by mistake!) that, while unorthodox, is quite effective. Here’s what it includes:

- **Markdown to HTML**: I write my blog posts in Markdown, and they're magically transformed into HTML. It keeps content creation straightforward and focused.
- **Template Inheritance**: Inspired by Django, this feature allows for reusing HTML structures, making the site more DRY. 
- **End-Note References**: I developed a method to transform `<a>` tags into `<end-note>` tags at build time. These give wikipedia inspired references directly in my articles, adding a neat touch to referencing. Running `plugins/referenceLists.ts` exports the titles of all anchors to a JSON format.
- **🚧 Semantic HTML**: I’ve made an effort to improve the site's semantics by ensuring titles are properly sectioned, aiming for better document structure and accessibility. This is just a first step though, accessibility still needs some work. 

Here's a how it works in short:

1. **Writing the Article**: I create a `.md` file and place it in the `src/articles` directory.

2. **Providing References**: I use the `plugins/referenceList.ts` script to generate a preliminary reference list for the article. It's a great starting point, but the references do still need some editing. This is not done at every build because it takes a fair amount of time. 
3. **The build?** Once the article and references are in place, the Vite-based build tool kicks into action, performing several tasks:
   - **Markdown to HTML**: Converts the Markdown article into semantic HTML.
   - **Link Transformation**: Transforms all `<a>` tags into `<end-note>` tags.
   - **Reference List Addition**: Automatically appends a reference list to the article, based on the reference JSON tags. The `<end-note>` tags refer to these.
   - **Template Integration**: Injects a predefined head, header, and footer into the article, providing a consistent look and feel across the site.
   - **Continuous Deployment**: Thanks to an existing Vite CI setup, every commit triggers a rebuild and deployment of the site to GitHub Pages. This effectively means that if the article is already in the repo I can do edits from everywhere, even my phone.

This streamlined process allows me to focus on creating content.

### Frontend Simplicity

On the client side, things are kept deliberately simple:

- **Web Components**: I’m utilizing Web Components, coded in TypeScript, to encapsulate logic or extremely tricky styling. `<dark-mode-toggle>`, `<nav-bar>` and `<project-card>` are all good examples of this.
- **HTML & CSS**: The design and layout stick to the basics of HTML and CSS. This approach ensures simplicity and clarity in the presentation.
- **❌ Client-side routing**: The project started off with a client-side router. It's no longer in use but it's kept in the repository. In the future it may get a new lease of life...


While this toolkit has been tailored specifically to my project's needs some of it holds potential for broader applications. If there's interest from the community, I'm entirely open to the idea of refining and expanding these tools to be more general-purpose. 

Hope to see you around! 🚀