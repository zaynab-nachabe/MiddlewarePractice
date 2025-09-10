class codeBox extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<p>Hello from MyComponent!</p>`;
  }
}
customElements.define('codeBox', MyComponent);