const defaultData = [
    {
        data: {
            trailingIcon: true,
            title: 'button 1 tooltip',
        },
        icon: 'favorite',
        value: 'Raised trailing favorite 1',
        obj: {
            t: '',
            p: '',
            k: 'b1',
        },
    },
    {
        data: {
            trailingIcon: true,
            title: 'button 2 tooltip',
        },
        icon: 'account-box',
        value: 'Raised trailing account-box 2',
        obj: {
            t: '',
            p: '',
            k: 'b2',
        },
    },
    {
        data: {
            title: 'button 3 tooltip',
        },
        icon: 'favorite',
        value: 'Raised favorite 3',
        obj: {
            t: '',
            p: '',
            k: 'b3',
        },
    },
    {
        data: {
            title: 'button 4 tooltip',
        },
        icon: 'favorite',
        value: 'Raised favorite 4',
        obj: {
            t: '',
            p: '',
            k: 'b4',
        },
    },
    {
        data: {
            trailingIcon: true,
            title: 'button dropdown tooltip',
        },
        icon: 'favorite',
        value: 'Raised trailing favorite dropdown',
        obj: {
            t: '',
            p: '',
            k: 'bddb',
        },
        children: [
            {
                value: 'first child',
                obj: {
                    t: '',
                    p: '',
                    k: 'child1',
                },
                icon: 'favorite',
            },
            {
                value: 'second child',
                obj: {
                    t: '',
                    p: '',
                    k: 'child2',
                },
            },
            {
                value: 'third child',
                obj: {
                    t: '',
                    p: '',
                    k: 'child3',
                },
            },
        ],
    },
    {
        data: {
            title: 'Display only dropdown button with icon settings',
            dropdownOnly: true,
        },
        icon: 'settings',
        value: '',
        obj: {
            t: '',
            p: '',
            k: 'bddb',
        },
        children: [
            {
                value: 'first child',
                obj: {
                    t: '',
                    p: '',
                    k: 'child1',
                },
                icon: 'favorite',
            },
            {
                value: 'second child',
                obj: {
                    t: '',
                    p: '',
                    k: 'child2',
                },
            },
            {
                value: 'third child',
                obj: {
                    t: '',
                    p: '',
                    k: 'child3',
                },
            },
        ],
    },
    {
        data: {
            title: 'Display only dropdown button with icon predefined',
            dropdownOnly: true,
        },
        icon: '',
        value: '',
        obj: {
            t: '',
            p: '',
            k: 'bddb',
        },
        children: [
            {
                value: 'first child',
                obj: {
                    t: '',
                    p: '',
                    k: 'child1',
                },
                icon: 'favorite',
            },
            {
                value: 'second child',
                obj: {
                    t: '',
                    p: '',
                    k: 'child2',
                },
            },
            {
                value: 'third child',
                obj: {
                    t: '',
                    p: '',
                    k: 'child3',
                },
            },
        ],
    },
];
const bottoniera1 = document.getElementById('button-list-orizzontale');
bottoniera1.data = defaultData;
bottoniera1.addEventListener('kup-button-list-click', (e) => {
    alert(
        'Clicked button with index: [' +
            e.detail.id +
            '] smeupObject selected [' +
            JSON.stringify(e.detail.obj) +
            ']'
    );
});

const bottoniera2 = document.getElementById('button-list-verticale');
bottoniera2.columns = 1;
bottoniera2.data = defaultData;

const bottoniera3 = document.getElementById('button-list-3-col');
bottoniera3.columns = 3;
bottoniera3.data = defaultData;

const bottoniera4 = document.getElementById('button-list-collapsed');
bottoniera4.data = defaultData;
