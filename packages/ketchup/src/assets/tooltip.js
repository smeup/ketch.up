function setTooltip(id) {
    const tooltip = document.getElementById('globaltooltip');
    let elem;
    if (id) {
        elem = document.getElementById(id);
    }
    let related;
    if (elem) {
        related = {
            element: elem,
            object: 'Sono il quadrato ' + elem.id,
        };
    }
    tooltip.relatedObject = related;
}

function onMouseOver(ev) {
    if (ev.target.id) {
        setTooltip(ev.target.id);
    }
}

function onMouseLeave() {
    setTooltip();
}

function loadData(event) {
    this.labelText = '';
    let data = {
        title: event.detail.object,
        content: {
            info1: {
                label: 'Author',
                value: 'Lana del Rey',
            },
            info2: {
                label: 'Year',
                value: 2012,
            },
        },
    };

    event.target.data = data;
}

const rosso = document.getElementById('rosso');
const verde = document.getElementById('verde');
const blu = document.getElementById('blu');
const t = document.getElementById('globaltooltip');

rosso.addEventListener('mouseover', onMouseOver);
verde.addEventListener('mouseover', onMouseOver);
blu.addEventListener('mouseover', onMouseOver);
rosso.addEventListener('mouseleave', onMouseLeave);
verde.addEventListener('mouseleave', onMouseLeave);
blu.addEventListener('mouseleave', onMouseLeave);
t.addEventListener('kup-tooltip-loaddata', loadData);
