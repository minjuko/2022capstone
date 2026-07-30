class CampsterHeader extends HTMLElement {
    connectedCallback() {
        const subtitle = this.getAttribute('subtitle') || '';
        const status = this.hasAttribute('status');
        const action = this.getAttribute('action');
        const badge = this.getAttribute('badge');

        let trailing = '';
        if (action === 'reset') {
            trailing = '<button class="header_action" id="reset-chat" type="button" aria-label="대화 다시 시작">↻</button>';
        } else if (badge) {
            trailing = `<span class="header_badge">${badge}</span>`;
        }

        this.innerHTML = `
            <header class="app_header">
                <div class="app_identity">
                    <h1 class="app_brand">CAMPSTER</h1>
                    ${subtitle ? `<p class="app_subtitle">${status ? '<span class="status_dot"></span>' : ''}${subtitle}</p>` : ''}
                </div>
                ${trailing}
            </header>
        `;
    }
}

class CampsterNavigation extends HTMLElement {
    connectedCallback() {
        const active = this.getAttribute('active') || '';
        const links = [
            { key: 'home', href: 'home.html', icon: 'house.svg', label: '홈' },
            { key: 'chat', href: 'index.html', icon: 'message-circle.svg', label: '챗봇' },
            { key: 'community', href: 'community.html', icon: 'users-round.svg', label: '커뮤니티' }
        ];

        const items = links.map((item) => {
            const isActive = item.key === active;
            return `
                <li>
                    <a href="${item.href}"${isActive ? ' class="active" aria-current="page"' : ''}>
                        <img src="../static/icons/${item.icon}" alt="">
                        <span>${item.label}</span>
                    </a>
                </li>
            `;
        }).join('');

        this.innerHTML = `
            <nav class="app_navigation" aria-label="주요 화면">
                <ul>${items}</ul>
            </nav>
        `;
    }
}

customElements.define('campster-header', CampsterHeader);
customElements.define('campster-navigation', CampsterNavigation);
