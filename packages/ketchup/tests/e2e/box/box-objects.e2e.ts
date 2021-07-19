import { newE2EPage } from '@stencil/core/testing';

import { j4btnData, pgbData } from './mocked-data';

import { boxSelector } from './box-selectors';

describe('renders different kind of objects', () => {
    it.skip('buttons', async () => {
        const page = await newE2EPage();

        await page.setContent('<kup-box></kup-box>');

        const element = await page.find('kup-box');

        element.setProperty('data', j4btnData);

        await page.waitForChanges();

        const boxes = await page.findAll(boxSelector);

        expect(boxes).toHaveLength(4);

        const kupBoxClick = await page.spyOnEvent('kup-box-click');

        const boxObjects = await boxes[0].findAll('.box-object');

        expect(boxObjects).toHaveLength(4);

        const kupButton = await boxObjects[3].find('kup-button');

        await kupButton.click();

        await page.waitForChanges();

        expect(kupBoxClick).toHaveLength(1);

        const detail = kupBoxClick.events[0].detail;

        expect(detail.column).toBe('FLD4');

        expect(detail.row).toEqual(j4btnData.rows[0]);
    });

    it('progressbar', async () => {
        const page = await newE2EPage();

        await page.setContent('<kup-box></kup-box>');

        const element = await page.find('kup-box');

        element.setProperty('data', pgbData);

        await page.waitForChanges();

        const boxes = await page.findAll(boxSelector);

        expect(boxes).toHaveLength(4);

        for (let i = 0; i < boxes.length; i++) {
            const pgb = await boxes[i].findAll('kup-progress-bar');

            //    expect(pgb).toHaveLength(1);
        }
    });
});
