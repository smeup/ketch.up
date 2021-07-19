export const gaugeShapesDataTable = {
  columns: [
    {
      name: 'GAU_00',
      title: 'Gau shapes',
    },
    {
      name: 'DESCR',
      title: 'Description',
    },
  ],
  rows: [
    {
      cells: {
        GAU_00: {
          data: {
            value: '',
          },
          obj: {
            t: 'NR',
            p: '',
            k: '',
          },
          shape: 'Gau',
        },
        DESCR: {
          value: 'No data',
        },
      },
    },
    {
      cells: {
        GAU_00: {
          data: {
            value: '50',
          },
          obj: {
            t: 'NR',
            p: '',
            k: '50',
          },
          value: '50',
          shape: 'Gau',
          options: false,
        },
        DESCR: {
          value: 'Only value',
        },
      },
    },
    {
      cells: {
        GAU_00: {
          data: {
            minValue: '30',
            maxValue: '150',
            value: '50',
          },
          obj: {
            t: 'NR',
            p: '',
            k: '50',
          },
          value: '50',
          shape: 'Gau',
          options: false,
        },
        DESCR: {
          value: 'Max and min',
        },
      },
    },
    {
      cells: {
        GAU_00: {
          data: {
            firstThreshold: '30',
            value: '50',
          },
          obj: {
            t: 'NR',
            p: '',
            k: '50',
          },
          value: '50',
          shape: 'Gau',
          options: false,
        },
        DESCR: {
          value: 'With one threshold',
        },
      },
    },
    {
      cells: {
        GAU_00: {
          data: {
            firstThreshold: '15',
            secondThreshold: '45',
            value: '50',
          },
          obj: {
            t: 'NR',
            p: '',
            k: '50',
          },
          value: '50',
          shape: 'Gau',
          options: false,
        },
        DESCR: {
          value: 'With two thresholds',
        },
      },
    },
    {
      cells: {
        GAU_00: {
          data: {
            reverseColors: 'true',
            value: '50',
          },
          obj: {
            t: 'NR',
            p: '',
            k: '50',
          },
          value: '50',
          shape: 'Gau',
          options: false,
        },
        DESCR: {
          value: 'Reverse colors',
        },
      },
    },
    {
      cells: {
        GAU_00: {
          data: {
            firstThreshold: '33',
            secondThreshold: '66',
            onlyValue: 'true',
            value: '50',
          },
          obj: {
            t: 'NR',
            p: '',
            k: '50',
          },
          value: '50',
          shape: 'Gau',
          options: false,
        },
        DESCR: {
          value: 'Only value',
        },
      },
    },
    {
      cells: {
        GAU_00: {
          data: {
            showValue: 'false',
            value: '50',
          },
          obj: {
            t: 'NR',
            p: '',
            k: '50',
          },
          value: '50',
          shape: 'Gau',
          options: false,
        },
        DESCR: {
          value: 'No show value',
        },
      },
    },
    {
      cells: {
        GAU_00: {
          data: {
            minValue: '0',
            firstThreshold: '20',
            maxValue: '200',
            secondThreshold: '50',
            measurementUnit: 'C°',
            value: '50',
          },
          obj: {
            t: 'NR',
            p: '',
            k: '50',
          },
          value: '50',
          shape: 'Gau',
          options: false,
        },
        DESCR: {
          value: 'With measurement unit',
        },
      },
    },
  ],
};
