class BamList extends HTMLElement {
    constructor() {
        super(); // always call super() fist in the ctor.

        let tmpl = document.createElement('template');
        tmpl.innerHTML = `<p>This is content</p>
<slot></slot>`;

        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {

    }

}

customElements.define('bam-list', BamList);