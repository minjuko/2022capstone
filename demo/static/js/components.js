class CampsterHeader extends HTMLElement {
    connectedCallback() {
        const subtitle = this.getAttribute('subtitle') || '';
        const action = this.getAttribute('action');

        let trailing = '';
        if (action === 'reset') {
            trailing = '<button class="header_action" id="reset-chat" type="button" aria-label="대화 다시 시작">↻</button>';
        }

        this.innerHTML = `
            <header class="app_header">
                <div class="app_identity">
                    <h1 class="app_brand">CAMPSTER</h1>
                    ${subtitle ? `<p class="app_subtitle">${subtitle}</p>` : ''}
                </div>
                ${trailing}
            </header>
        `;
    }
}

customElements.define('campster-header', CampsterHeader);
