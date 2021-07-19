import { newE2EPage } from '@stencil/core/testing';

describe('kup-button-list', () => {
    it('renders', async () => {
        const page = await newE2EPage();

        await page.setContent('<kup-button-list></kup-button-list>');
        const element = await page.find('kup-button-list');
        expect(element).toHaveClass('hydrated');
    });

    it('testing no buttons', async () => {
        // no buttons, no config
        const page = await newE2EPage();

        await page.setContent('<kup-button-list></kup-button-list>');

        const buttons = await page.findAll('kup-button-list >>> kup-button');
        expect(buttons).toHaveLength(0);
    });

    it('renders buttons with only text', async () => {
        // only buttons
        const page = await newE2EPage();

        await page.setContent('<kup-button-list></kup-button-list>');

        const btn = await page.find('kup-button-list');

        const buttons = [
            {
                value: 'Btn #1',
            },
            {
                value: 'Btn #2',
            },
        ];

        btn.setProperty('data', buttons);

        await page.waitForChanges();

        const rows = await page.findAll('kup-button-list >>> div.f-button--wrapper');
        expect(rows).toHaveLength(buttons.length);

        for (let i = 0; i < rows.length; i++) {
            const div = rows[i];

            expect(div).toHaveAttribute('id');

            const button = await div.find('button');
            expect(button).not.toBeNull();

            // testint text
            const text = await button.find('.button__label');
            expect(text).not.toBeNull();
            expect(text).toEqualText(buttons[i].value);

            expect(button).toHaveClasses(['button']);
            // no title
            expect(button.getAttribute('title')).toBeNull();
        }
    });

    it('renders buttons with icons', async () => {
        // only buttons
        const page = await newE2EPage();

        await page.setContent('<kup-button-list></kup-button-list>');

        const btn = await page.find('kup-button-list');

        const buttons = [
            {
                value: 'Btn #1',
                icon: 'grid_on',
            },
            {
                value: 'Btn #2',
                icon: 'grid_off',
            },
        ];

        btn.setProperty('data', buttons);

        await page.waitForChanges();

        const rows = await page.findAll('kup-button-list >>> div.f-button--wrapper');
        expect(rows).toHaveLength(buttons.length);

        for (let i = 0; i < rows.length; i++) {
            const div = rows[i];

            expect(div).toHaveAttribute('id');

            const button = await div.find('button');
            expect(button).not.toBeNull();

            // testint text
            const text = await button.find('.button__label');
            expect(text).not.toBeNull();
            expect(text).toEqualText(buttons[i].value);

            expect(button).toHaveClasses(['button']);
            // no title
            expect(button.getAttribute('title')).toBeNull();
        }
    });

    it('renders buttons in columns', async () => {
        // only buttons
        const page = await newE2EPage();

        await page.setContent('<kup-button-list></kup-button-list>');

        const btn = await page.find('kup-button-list');

        const buttons = [
            {
                value: 'Btn #1',
                icon: 'grid_on',
            },
            {
                value: 'Btn #2',
                icon: 'grid_off',
            },
        ];

        btn.setProperty('data', buttons);
        btn.setProperty('columns', 2);

        await page.waitForChanges();

        const rows = await page.findAll('kup-button-list >>> div.f-button--wrapper');
        expect(rows).toHaveLength(buttons.length);

        const kupbtn = await page.find('kup-button-list');
        expect(kupbtn).not.toBeNull();

        kupbtn
            .getProperty('columns')
            .then((v) => expect(v == '2').toBeTruthy());
    });

    it('buttons and collapsed button', async () => {
        // only buttons
        const page = await newE2EPage();

        await page.setContent('<kup-button-list></kup-button-list>');

        const btn = await page.find('kup-button-list');

        const buttons = [
            {
                value: 'Btn #1',
                icon: 'grid_on',
            },
            {
                value: 'Btn #2',
                icon: 'grid_off',
            },
            {
                icon: 'favorite',
                value: 'Btn #3 dropdown',
                children: [
                    {
                        value: 'first child',
                        icon: 'favorite',
                    },
                    {
                        value: 'second child',
                    },
                    {
                        value: 'third child',
                    },
                ],
            },
        ];

        btn.setProperty('data', buttons);

        await page.waitForChanges();

        const btns = await page.findAll('kup-button-list >>> div.f-button--wrapper');
        expect(btns).toHaveLength(buttons.length - 1);
        const ddbtns = await page.findAll('kup-button-list >>> kup-dropdown-button');
        expect(ddbtns).toHaveLength(1);
    });
});
