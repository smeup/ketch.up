const button = document.querySelector('#card-generator');
const wrapper = document.querySelector('#card-wrapper');

button.addEventListener('click', () => {
    createCard();
});

function createCard() {
    try {
        document.querySelector('#test-card').remove();
    } catch (error) {}
    const card = document.createElement('kup-card');
    card.id = 'test-card';
    card.layoutNumber = 13;
    card.data = createData();
    wrapper.append(card);
}

function createData() {
    let data = { button: [] };
    for (let index = 0; index < 1000; index++) {
        const button = { icon: 'widgets', label: 'ciao' };
        data.button.push(button);
    }
    return data;
}
