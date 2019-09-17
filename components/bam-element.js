let BamElement = (function(){
    let innerState = {
            bam: bam,
            undefined: {}
        },
        shadowRoot = null,
        props = {};

    class BamElement extends HTMLElement {
        constructor() {
            super(); // always call super() fist in the ctor.
            shadowRoot = this.attachShadow({mode: 'open'});

            // this.resolveModel().then(model => {                
            //     this.renderer.render(this.view, model, (e, r) => {
            //         if(e){
            //             throw new Error("Failed to render template: " + e);
            //         }
            //         let tmpl = document.createElement('template');
            //         tmpl.innerHTML = r;
            //         shadowRoot.appendChild(tmpl.content.cloneNode(true));                
            //     });
            // })
            // this.renderer.render(this.view, this.model, (e, r) => {
            //     if(e){
            //         throw new Error("Failed to render template: " + e);
            //     }
            //     let tmpl = document.createElement('template');
            //     tmpl.innerHTML = r;
            //     shadowRoot.appendChild(tmpl.content.cloneNode(true));                
            // });
        }
    
        connectedCallback() {            
            this.resolveModel().then(model => {                
                this.renderer.render(this.view, model, (e, r) => {
                    if(e){
                        throw new Error("Failed to render template: " + e);
                    }
                    let tmpl = document.createElement('template');
                    tmpl.innerHTML = r;
                    shadowRoot.appendChild(tmpl.content.cloneNode(true));                
                });
            })
        }
    
        disconnectedCallback() {
    
        }
    
        attributeChangedCallback(attrName, oldVal, newVal) {
            alert(`${attrName} changed:  old=${oldValue} new=${newVal}`);
        }
    
        prop(propName, propValue){
            if(propValue !== undefined){
                props[propName] = propValue;
            }
            return props[propName];
        }

        resolveModel(){
            return new Promise((resolve, reject) => {
                resolve({name: this.getAttribute("model") || "model attribute not specified"});
            })            
        }
    
        get view(){    
            return this.getAttribute("view");
        }
        set view(vewName){
            this.setAttribute("view");
        }
            
        get renderer(){
            let rendererName = this.getAttribute("renderer") || "dust",
                bam = innerState.bam;                
            
            return bam.renderer(rendererName) || dust;
        }
    }

    customElements.define('bam-element', BamElement);  
    return BamElement;
})()
