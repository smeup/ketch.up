const baseData = {
    columns: [
        {
            name: 'Col1',
            title: 'Person',
            size: '10',
        },
        {
            name: 'Col2',
            title: 'Value',
            size: '10',
        },
        {
            name: 'Col3',
            title: 'Value2',
            size: '10',
        },
    ],
    rows: [
        {
            cells: {
                Col1: {
                    obj: {
                        t: 'CN',
                        p: 'COL',
                        k: 'CASFRA',
                    },
                    value: 'CASFRA',
                },
                Col2: {
                    obj: {
                        t: 'NR',
                        p: '',
                        k: '10',
                    },
                    value: '10',
                },
                Col3: {
                    obj: {
                        t: 'NR',
                        p: '',
                        k: '100.60',
                    },
                    value: '100.60',
                },
            },
        },
        {
            cells: {
                Col1: {
                    obj: {
                        t: 'CN',
                        p: 'COL',
                        k: 'DELGIO',
                    },
                    value: 'DELGIO',
                },
                Col2: {
                    obj: {
                        t: 'NR',
                        p: '',
                        k: '6',
                    },
                    value: '6',
                },
                Col3: {
                    obj: {
                        t: 'NR',
                        p: '',
                        k: '67.8',
                    },
                    value: '67.8',
                },
            },
        },
        {
            cells: {
                Col1: {
                    obj: {
                        t: 'CN',
                        p: 'COL',
                        k: 'PARFRA',
                    },
                    value: 'PARFRA',
                },
                Col2: {
                    obj: {
                        t: 'NR',
                        p: '',
                        k: '5',
                    },
                    value: '5',
                },
                Col3: {
                    obj: {
                        t: 'NR',
                        p: '',
                        k: '120.06',
                    },
                    value: '120.06',
                },
            },
        },
    ],
};

const baseConfig = {
    types: ['Hbar'],
    axis: 'Col1',
    series: [{ code: 'Col2' }, { code: 'Col3' }],
};
const keys = Object.keys(baseConfig);

// HBAR
const hbar = document.getElementById('hbar');
hbar.data = baseData;
for (let k of keys) {
    hbar[k] = baseConfig[k];
}

// VBAR
const vbar = document.getElementById('vbar');
vbar.data = baseData;
for (let k of keys) {
    vbar[k] = baseConfig[k];
}
vbar.types = ['Vbar'];

document
    .getElementById('vbar-stacked')
    .addEventListener('change', ({ target }) => {
        vbar.stacked = target.checked;
    });

// PIE
const pie = document.getElementById('pie');
pie.data = baseData;
for (let k of keys) {
    pie[k] = baseConfig[k];
}
pie.types = ['Pie'];
pie.series = [{ code: 'Col2' }];

document.getElementById('pie-aspect').addEventListener('change', (e) => {
    pie.asp = e.target.checked ? '3D' : '';
});

// custom colors
document.getElementById('colors').addEventListener('change', ({ target }) => {
    const charts = document.querySelectorAll('kup-chart');

    charts.forEach((chart) => {
        if (target.checked) {
            chart.colors = ['#ccc', '#333', '#666'];
        } else {
            chart.colors = [];
        }
    });
});

// custom size
document.getElementById('size').addEventListener('change', ({ target }) => {
    const charts = document.querySelectorAll('kup-chart');

    charts.forEach((chart) => {
        if (target.checked) {
            chart.sizeX = '400px';
            chart.sizeY = '400px';
        } else {
            chart.sizeX = '100%';
            chart.sizeY = '100%';
        }
    });
});

// enable / disable legend
document.getElementById('legend').addEventListener('change', ({ target }) => {
    const charts = document.querySelectorAll('kup-chart');

    charts.forEach((chart) => {
        chart.legend = target.checked ? 'right' : 'none';
    });
});

// title
document.getElementById('title').addEventListener('change', ({ target }) => {
    const charts = document.querySelectorAll('kup-chart');

    charts.forEach((chart) => {
        let cTitle = chart.chartTitle;
        if (cTitle == null) {
            cTitle = {};
        }
        cTitle.value = target.value;
        chart.chartTitle = { ...cTitle };
    });
});

// title color
document
    .getElementById('title-color')
    .addEventListener('change', ({ target }) => {
        const charts = document.querySelectorAll('kup-chart');

        charts.forEach((chart) => {
            let cTitle = chart.chartTitle;
            if (cTitle == null) {
                cTitle = {};
            }
            cTitle.color = target.value;
            chart.chartTitle = { ...cTitle };
        });
    });

// title size
document
    .getElementById('title-size')
    .addEventListener('change', ({ target }) => {
        console.log(target.value);

        if (!target.value) {
            return;
        }

        const charts = document.querySelectorAll('kup-chart');

        charts.forEach((chart) => {
            let cTitle = chart.chartTitle;
            if (cTitle == null) {
                cTitle = {};
            }
            cTitle.size = Number(target.value);
            chart.chartTitle = { ...cTitle };
        });
    });
