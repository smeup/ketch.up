export const jlObjectsDataTable = {
  columns: [
    {
      name: 'JL_00',
      title: 'JL Objects',
    },
  ],
  rows: [
    {
      cells: {
        JL_00: {
          obj: {
            t: 'JL',
            p: '**',
            k: '',
          },
          value: '',
        },
      },
    },
    {
      cells: {
        JL_00: {
          data: {
            data: [
              {
                value: 'text',
                label: 'Text only',
              },
              {
                value: 'icon',
                icon: 'widgets',
                label: 'With icon',
              },
            ],
          },
          obj: {
            t: 'JL',
            p: '**',
            k: 'text;icon',
          },
          value: 'text;icon',
          options: false,
        },
      },
    },
    {
      cells: {
        JL_00: {
          data: {
            data: [
              {
                label: 'Federico Robertozzi',
              },
              {
                label: 'Parodonte Frascati',
              },
            ],
          },
          obj: {
            t: 'JL',
            p: 'CNCOL',
            k: 'FEDROB;PARFRA',
          },
          value: 'Federico Robertozzi;Parodonte Frascati',
          options: false,
        },
      },
    },
  ],
};
