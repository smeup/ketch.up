const buttonMdcw = document.querySelector('#mdcw');
const buttonNoMdcw = document.querySelector('#no-mdcw');
const wrapper = document.querySelector('#card-wrapper');

buttonMdcw.addEventListener('click', () => {
    createCard(true);
});
buttonNoMdcw.addEventListener('click', () => {
    createCard(false);
});

function createCard(mdcw) {
    try {
        document.querySelector('#test-card').remove();
    } catch (error) {}
    const card = document.createElement('kup-card');
    card.customStyle =
        '#kup-component .section-1 {display:grid; grid-template-columns: repeat(18, 1fr);}';
    card.id = 'test-card';
    card.layoutNumber = 13;
    card.data = createData(mdcw);
    card.sizeY = '80vh';
    wrapper.append(card);
}

function createData(mdcw) {
    let data = { button: [], buttonmdcw: [] };
    for (let index = 0; index < 1000; index++) {
        const button = { icon: 'widgets', label: 'ciao' };
        if (mdcw) {
            data.buttonmdcw.push(button);
        } else {
            data.button.push(button);
        }
    }
    return data;
}
