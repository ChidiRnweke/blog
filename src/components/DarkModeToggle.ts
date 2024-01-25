import { getElementOrThrow, getLocalStorageOrThrow } from "../utils/dom";

class DarkModeToggle extends HTMLElement {
    public link!: string;
    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
<style>
  .switch {
    position: relative;
    display: inline-block;
    width: 4rem;
    height: 2rem;
  }

  .switch .toggle {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc; 
    transition: .4s;
    border-radius: 2rem;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.5rem;
    width: 1.5rem;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3; 
  }

  input:checked + .slider:before {
    transform: translateX(2rem); 
  }


  body.dark-theme .slider {
    background-color: #4D4D4D; /
  }

  body.dark-theme .slider:before {
    background-color: #BFBFBF; 
  }

  .slider.round {
    border-radius: 2rem;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>

<label class="switch">
  <input type="checkbox" class="toggle">
  <span class="slider round"></span>
</label>
       `;
    }
    public connectedCallback(): void {
        this.addEventListeners();
        this.initializeDarkMode()

    }

    private initializeDarkMode(): void {
        const noExistingTheme = localStorage.getItem('theme');
        const toggle = getElementOrThrow(this.shadowRoot!, '.toggle') as HTMLInputElement;

        if (!noExistingTheme) {
            this.initiateLocalStorage();
        }

        const currentTheme = getLocalStorageOrThrow('theme')!;
        if (currentTheme === "dark") {
            document.body.classList.add("dark-theme");
            toggle.checked = true;
        } else {
            document.body.classList.remove("dark-theme");
            toggle.checked = false;
        }
    }

    private initiateLocalStorage() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            localStorage.setItem("theme", "dark");
        }
        else {
            localStorage.setItem("theme", "light")
        }
    }

    private addEventListeners(): void {
        const toggle = getElementOrThrow(this.shadowRoot!, '.toggle') as HTMLInputElement;
        toggle.addEventListener('click', () => this.handleDarkModeToggle(toggle.checked));
    }

    private handleDarkModeToggle(isDarkMode: boolean): void {
        document.body.classList.toggle('dark-theme', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

}
customElements.define('dark-mode-toggle', DarkModeToggle);

