class BamRenderedData extends HTMLElement {
    constructor() {
        super(); // always call super() fist in the ctor.

        let tmpl = document.createElement('template');
        tmpl.innerHTML = `<p>This is content</p>
<slot></slot>`;

        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
    }

    static get observedAttributes() {
        return []; // a list of attribute names
    }

    connectedCallback() {
        
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {

    }

    get dataSource() {
        return this.getAttribute('data-source');
    }
    set dataSource(val) {
        this.setAttribute('data-source', val);
    }
}

customElements.define('bam-rendered-data', BamRenderedData);