const defaultData = {
    title: 'title for nav-bar',
    menuActions: [
        { icon: 'search', value: 'AA', text: 'Search AA' },
        { icon: 'search', value: 'BB', text: 'Search BB' },
        { icon: 'search', value: 'CC', text: 'Search CC' },
        { icon: 'search', value: 'DD', text: 'Search DD' },
    ],
    optionActions: [
        { icon: 'favorite', value: 'f', tooltip: 'Favorite', visible: true },
        { icon: 'search', value: 's', tooltip: 'Search', visible: true },
        { icon: 'search', value: 'A', text: 'Search A' },
        { icon: 'search', value: 'B', text: 'Search B' },
        { icon: 'search', value: 'C', text: 'Search C' },
        { icon: 'search', value: 'D', text: 'Search D' },
    ],
};
const navBar = document.getElementById('navbar');
if (navBar != null) {
    navBar.data = { ...defaultData };
}

const navBarShort = document.getElementById('navbar-short');
if (navBarShort != null) {
    navBarShort.data = { ...defaultData };
    navBarShort.data.title = 'navbar with mode';
}

document.querySelectorAll('kup-checkbox').forEach((f) => {
    f.addEventListener('kup-checkbox-change', ({ detail }) => {
        kup-checkbox-change_listener(detail.checked);
    });
});

document.querySelectorAll('kup-nav-bar').forEach((f) => {
    f.addEventListener('kupMenuItemClick', ({ detail }) => {
        kupMenuItemClick_listener(detail.value);
    });
});

function kup-checkbox-change_listener(checked) {
    let changedDefaultData = { ...defaultData };
    let customStyle = null;
    if (checked == true) {
        changedDefaultData.title = 'contextual nav bar';
        changedDefaultData.menuAction = {
            icon: 'close',
            value: 'close',
            text: 'Close button',
        };
        changedDefaultData.menuActions = null;
        customStyle = ':host { --kup-nav-bar-background-color: blue; }';
    }
    const navBar = document.getElementById('navbar');
    if (navBar != null) {
        navBar.data = changedDefaultData;
        navBar.customStyle = customStyle;
    }
}

function kupMenuItemClick_listener(value) {
    alert(value);

    if (value == 'close') {
        const checkBox = document.getElementById('itemSelect');
        if (checkBox != null) {
            checkBox.checked = false;
            kup-checkbox-change_listener(false);
        }
    }
}
