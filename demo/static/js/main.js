const DEMO_CAMPS = [
    {
        name: '포천 숲속 캠프',
        tags: ['서울 근교', '숲', '초보 추천'],
        description: '넓은 데크와 편의시설을 갖춘 조용한 숲 캠핑장입니다.',
        distance: '서울에서 약 1시간 20분',
        accent: 'FOREST'
    },
    {
        name: '가평 별빛 캠핑장',
        tags: ['별', '한적함', '반려동물'],
        description: '사이트 간격이 넓고 밤하늘이 탁 트인 소규모 캠핑장입니다.',
        distance: '서울에서 약 1시간 40분',
        accent: 'STARRY'
    },
    {
        name: '태안 노을 오토캠핑',
        tags: ['바다', '노을', '오토캠핑'],
        description: '해변 산책과 서해 노을을 함께 즐길 수 있는 캠핑장입니다.',
        distance: '서울에서 약 2시간 10분',
        accent: 'SUNSET'
    }
];

const EQUIPMENT = {
    텐트: {
        name: '2~3인용 돔 텐트',
        description: '설치가 단순하고 부피가 작아 첫 캠핑 장비로 적합합니다.',
        tips: ['내수압 1,500mm 이상', '알루미늄 폴', '전실 포함 여부 확인']
    },
    침낭: {
        name: '3계절 사각 침낭',
        description: '봄부터 초가을까지 활용하기 편하고 세탁과 보관이 간단합니다.',
        tips: ['쾌적 온도 확인', '수납 크기 비교', '지퍼 연결 가능 여부']
    },
    조명: {
        name: '충전식 LED 랜턴',
        description: '밝기 조절과 보조 배터리 기능이 있는 제품을 추천합니다.',
        tips: ['최대 사용 시간', '생활 방수', '따뜻한 색온도']
    }
};

const state = {
    name: '',
    step: 'name'
};

const messages = document.querySelector('.messages');
const input = document.querySelector('#message-input');
const sendButton = document.querySelector('#send_message');
const resetButton = document.querySelector('#reset-chat');
const quickPrompts = document.querySelector('#quick-prompts');
const template = document.querySelector('.message_template .message');

function syncSendButton() {
    sendButton.disabled = !input.value.trim();
}

function scrollToLatest() {
    requestAnimationFrame(() => {
        messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
    });
}

function appendMessage(content, side = 'left', options = {}) {
    const message = template.cloneNode(true);
    message.classList.add(side);
    const text = message.querySelector('.text');

    if (options.node) {
        text.append(content);
    } else {
        text.textContent = content;
    }

    messages.append(message);
    requestAnimationFrame(() => message.classList.add('appeared'));
    scrollToLatest();
    return message;
}

function appendTyping(callback) {
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.setAttribute('aria-label', '답변 작성 중');
    typing.innerHTML = '<span></span><span></span><span></span>';
    const message = appendMessage(typing, 'left', { node: true });

    window.setTimeout(() => {
        message.remove();
        callback();
    }, 450);
}

function createActions(items) {
    const group = document.createElement('div');
    group.className = 'message_actions';

    items.forEach(({ label, value }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.addEventListener('click', () => handleMessage(value || label));
        group.append(button);
    });
    return group;
}

function showMainMenu() {
    const content = document.createElement('div');
    const greeting = document.createElement('p');
    greeting.textContent = `${state.name}님, 어떤 캠핑을 준비하고 계세요?`;
    content.append(greeting);
    content.append(createActions([
        { label: '지역으로 캠핑장 찾기', value: '서울 근교 캠핑장을 추천해줘' },
        { label: '취향으로 캠핑장 찾기', value: '별이 잘 보이는 조용한 캠핑장' },
        { label: '캠핑 장비 추천받기', value: '초보자용 텐트를 추천해줘' }
    ]));
    appendMessage(content, 'left', { node: true });
}

function createCampCards(camps) {
    const wrapper = document.createElement('div');
    wrapper.className = 'result_stack';

    const intro = document.createElement('p');
    intro.className = 'result_intro';
    intro.textContent = '입력한 조건에 어울리는 캠핑장을 골라봤어요.';
    wrapper.append(intro);

    camps.forEach((camp, index) => {
        const card = document.createElement('article');
        card.className = 'result_card';
        const imageMarkup = camp.image
            ? `<img class="result_image" src="${escapeAttribute(camp.image)}" alt="${escapeAttribute(camp.name)} 전경">`
            : '';
        card.innerHTML = `
            <div class="result_visual tone-${index + 1}">
                ${imageMarkup}
                <span class="result_accent">${escapeHtml(camp.accent)}</span>
            </div>
            <div class="result_body">
                <div class="result_heading">
                    <h3>${escapeHtml(camp.name)}</h3>
                    <span class="result_rank">추천 ${index + 1}</span>
                </div>
                <span class="result_distance">${escapeHtml(camp.distance)}</span>
                <p>${escapeHtml(camp.description)}</p>
                <div class="result_tags">${camp.tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join('')}</div>
            </div>
        `;
        const image = card.querySelector('.result_image');
        image?.addEventListener('error', () => image.remove());
        wrapper.append(card);
    });

    const note = document.createElement('small');
    note.className = 'demo_note';
    note.textContent = camps.some((camp) => camp.isLive)
        ? '한국관광공사 고캠핑 API에서 조회한 정보입니다.'
        : '포트폴리오 데모용 예시 데이터입니다.';
    wrapper.append(note);
    return wrapper;
}

function createEquipmentCard(type) {
    const item = EQUIPMENT[type];
    const card = document.createElement('article');
    card.className = 'equipment_card';
    card.innerHTML = `
        <span class="card_eyebrow">BEGINNER PICK</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <ul>${item.tips.map((tip) => `<li>${tip}</li>`).join('')}</ul>
        <small>포트폴리오 데모용 예시 추천입니다.</small>
    `;
    return card;
}

function escapeHtml(value) {
    const element = document.createElement('div');
    element.textContent = String(value || '');
    return element.innerHTML;
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/"/g, '&quot;');
}

function mapLiveCamp(camp, index) {
    return {
        name: camp.name,
        tags: camp.tags || [],
        description: camp.description,
        distance: camp.address,
        accent: 'GO CAMPING',
        image: camp.image,
        isLive: true,
        index
    };
}

async function requestLiveCamps(query) {
    const response = await fetch(`/api/campsites?q=${encodeURIComponent(query)}`, {
        headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('API proxy unavailable');
    const payload = await response.json();
    return payload.source === 'live' ? payload.items.map(mapLiveCamp) : [];
}

async function answerQuery(query) {
    const normalized = query.replace(/\s/g, '');
    const equipmentType = Object.keys(EQUIPMENT).find((key) => normalized.includes(key));

    if (equipmentType || normalized.includes('장비')) {
        appendTyping(() => {
            appendMessage(createEquipmentCard(equipmentType || '텐트'), 'left', { node: true });
        });
        return;
    }

    let camps = [];
    try {
        camps = await requestLiveCamps(query);
    } catch (error) {
        console.info('고캠핑 API를 사용할 수 없어 예시 데이터로 전환합니다.');
    }

    if (!camps.length) {
        camps = DEMO_CAMPS;
        if (normalized.includes('별') || normalized.includes('조용')) {
            camps = [DEMO_CAMPS[1], DEMO_CAMPS[0]];
        } else if (normalized.includes('바다') || normalized.includes('노을')) {
            camps = [DEMO_CAMPS[2], DEMO_CAMPS[1]];
        }
    }
    appendTyping(() => appendMessage(createCampCards(camps), 'left', { node: true }));
}

function handleMessage(rawMessage) {
    const message = rawMessage.trim();
    if (!message) return;

    appendMessage(message, 'right');
    input.value = '';
    syncSendButton();

    if (state.step === 'name') {
        state.name = message.slice(0, 12);
        state.step = 'recommend';
        quickPrompts.hidden = false;
        input.placeholder = '캠핑 취향이나 장비를 물어보세요';
        appendTyping(showMainMenu);
        return;
    }

    answerQuery(message);
}

function resetChat() {
    state.name = '';
    state.step = 'name';
    quickPrompts.hidden = true;
    input.placeholder = '사용할 닉네임을 입력해주세요';
    syncSendButton();
    messages.replaceChildren();
    appendTyping(() => {
        appendMessage('안녕하세요! 취향에 맞는 캠핑장과 장비를 찾아드리는 캠스터예요.', 'left');
        appendMessage('먼저 사용할 닉네임을 알려주세요.', 'left');
    });
    input.focus();
}

sendButton.addEventListener('click', () => handleMessage(input.value));
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.isComposing) {
        event.preventDefault();
        handleMessage(input.value);
    }
});
input.addEventListener('input', syncSendButton);
resetButton.addEventListener('click', resetChat);
quickPrompts.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-message]');
    if (!button) return;

    if (state.step === 'name') {
        appendMessage('먼저 닉네임을 입력해주세요.', 'left');
        input.focus();
        return;
    }
    handleMessage(button.dataset.message);
});

resetChat();
