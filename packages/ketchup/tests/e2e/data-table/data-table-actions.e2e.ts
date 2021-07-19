import { newE2EPage } from '@stencil/core/testing';

import {
    headerCellsSelector,
    rowsSelector,
    cellsSelector,
    rowExpanderSelector,
} from './data-table-selectors';

const values = ['DELGIO', 'CASFRA', 'PARFRA', 'FIOGIA', 'ZAMCHI'];

function createActionData() {
    const columns: any = [];
    for (let i = 0; i < 3; i++) {
        columns.push({
            name: 'FLD' + i,
            title: 'Column ' + i,
            size: 10,
        });
    }

    const rows = [];
    for (let i = 0; i < 9; i++) {
        const currentRow: {
            cells: any;
        } = {
            cells: {},
        };

        for (let j = 0; j < columns.length; j++) {
            const cell: any = {};

            cell.value = i.toString() + j.toString();

            cell.obj = {
                t: 'NR',
                p: '',
                k: cell.value,
            };

            if (j === 0) {
                cell.obj.t = '';
                cell.value = values[i % values.length];
                cell.obj.k = cell.value;
            }

            currentRow.cells[columns[j].name] = cell;
        }

        rows.push(currentRow);
    }

    return {
        columns,
        rows,
    };
}

const actionsData = createActionData();

// TODO there is an error here: the column does not paint the icon
describe('renders actions', () => {
    it.skip('without grouping', async () => {
        const page = await newE2EPage();

        await page.setContent('<kup-data-table></kup-data-table>');
        const element = await page.find('kup-data-table');

        element.setProperty('data', actionsData);
        element.setProperty('rowActions', [
            {
                text: 'Action #1',
                icon: 'account',
            },
            {
                text: 'Action #2',
                icon: 'plus',
            },
        ]);

        await page.waitForChanges();

        // testing header
        const headerCells = await page.findAll(headerCellsSelector);
        expect(headerCells).toHaveLength(4);

        expect(headerCells[0].innerHTML).toBe('');

        for (let i = 1; i < headerCells.length; i++) {
            const title = await headerCells[i].find('.column-title');

            expect(title).toEqualText(`Column ${i - 1}`);
        }

        // testing cells
        const cells = await page.findAll(cellsSelector);

        expect(cells).toHaveLength(36);

        // first cell -> actions
        const firstCell = cells[0];
        const actions = await firstCell.findAll('.row-action');
        expect(actions).toHaveLength(3);

        const kupRowActionClick = await page.spyOnEvent(
            'kup-datatable-rowactionclick'
        );

        // testing default action
        await actions[0].click();

        await page.waitForChanges();

        expect(kupRowActionClick).toHaveLength(1);

        const detail = kupRowActionClick.events[0].detail;

        expect(detail.type).toBe('default');
        expect(detail.action).toEqual({
            text: 'Action #1',
            icon: 'account',
        });
        expect(detail.index).toBe(0);

        // testing expander
        await actions[2].click();

        await page.waitForChanges();

        expect(kupRowActionClick).toHaveLength(2);

        const detail2 = kupRowActionClick.events[1].detail;

        expect(detail2.type).toBe('expander');
    });

    it.skip('with visible grouping', async () => {
        const page = await newE2EPage();

        await page.setContent('<kup-data-table></kup-data-table>');
        const element = await page.find('kup-data-table');

        element.setProperty('data', actionsData);
        element.setProperty('groups', [{ column: 'FLD0', visible: true }]);
        element.setProperty('rowActions', [
            {
                text: 'Action #1',
                icon: 'account',
            },
            {
                text: 'Action #2',
                icon: 'plus',
            },
        ]);

        await page.waitForChanges();

        // testing header
        const headerCells = await page.findAll(headerCellsSelector);
        expect(headerCells).toHaveLength(4);

        expect(headerCells[0].innerHTML).toBe('');

        for (let i = 1; i < headerCells.length; i++) {
            const title = await headerCells[i].find('.column-title');

            expect(title).toEqualText(`Column ${i - 1}`);
        }

        // testing rows
        const rows = await page.findAll(rowsSelector);

        expect(rows).toHaveLength(5);

        for (let row of rows) {
            expect(row).toHaveClass('group');

            const cells = await row.findAll('td');
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqualAttribute('colspan', '4');
        }

        // expanding row
        const expander = await page.find(rowExpanderSelector);
        await expander.click();

        await page.waitForChanges();

        const newRows = await page.findAll(rowsSelector);
        expect(newRows).toHaveLength(7);

        for (let i = 1; i < 3; i++) {
            const row = newRows[i];

            expect(row).not.toHaveClass('group');

            const cells = await row.findAll('td');
            expect(cells).toHaveLength(4);

            const actions = await cells[0].findAll('.row-action');
            expect(actions).toHaveLength(3);
        }
    });
});
