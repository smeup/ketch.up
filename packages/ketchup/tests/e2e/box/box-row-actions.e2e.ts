import { newE2EPage } from '@stencil/core/testing';

import { defaultData } from './mocked-data';

import { boxWrapperSelector } from './box-selectors';

describe('row actions', () => {
    it('without row actions', async () => {
        const page = await newE2EPage();

        await page.setContent('<kup-box></kup-box>');

        await page.waitForChanges();

        const element = await page.find('kup-box');

        element.setProperty('data', defaultData);

        await page.waitForChanges();

        const boxes = await page.findAll(boxWrapperSelector);

        expect(boxes).toHaveLength(4);

        for (let i = 0; i < boxes.length; i++) {
            const actionMenu = await boxes[i].findAll('.row-actions-wrapper');

            expect(actionMenu).toHaveLength(0);
        }
    });

    it('with row actions', async () => {
        const page = await newE2EPage();

        await page.setContent('<kup-box></kup-box>');

        await page.waitForChanges();

        const element = await page.find('kup-box');

        element.setProperty('data', defaultData);

        element.setProperty('enableRowActions', true);

        await page.waitForChanges();

        const boxes = await page.findAll(boxWrapperSelector);

        expect(boxes).toHaveLength(4);

        //const kupRowActionMenuClick = await page.spyOnEvent(
        //    'kup-box-rowactionmenuclick'
        //);

        for (let i = 0; i < boxes.length; i++) {
            const actionMenu = await boxes[i].findAll('.row-actions-wrapper');

            expect(actionMenu).toHaveLength(1);

            const svg = await actionMenu[0].find('svg');

            await svg.click();

            await page.waitForChanges();
        }

        // expect(kup-box-rowactionmenuclick).toHaveLength(4);
    });
});
