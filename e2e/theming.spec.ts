import { test, expect } from './fixtures';

/**
 * The theming contract. pure-css's runtime layer is the --pc-* tokens; the
 * --base-* layer is the authoring source of truth plus one runtime bridge
 * (--pc-border-color: var(--base-border-color, ...)) that Keenmate components
 * also read. These specs pin both the defaults and the two live cascades so a
 * variable rename or a broken link can't slip through.
 */
test.beforeEach(async ({ page }) => {
    await page.goto('/test/theming.html');
});

test('base.css emits the default accent tokens at :root', async ({ page }) => {
    const { pc, base } = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        return {
            pc: cs.getPropertyValue('--pc-primary-color').trim(),
            base: cs.getPropertyValue('--base-primary-color').trim()
        };
    });
    expect(pc).toBe('#0ea5e9');
    expect(base).toBe('#0ea5e9');

    // ...and it renders: default .text-primary is the primary FOREGROUND —
    // the fill 45% toward black (--base-primary-text-color), not the fill itself.
    const color = await page
        .locator('#default-primary')
        .evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('color(srgb 0.0301961 0.355882 0.502549)');
});

test('overriding --pc-primary-text-color re-themes .text-primary live', async ({ page }) => {
    const color = await page
        .locator('#accent-text')
        .evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('rgb(255, 0, 0)');
});

test('--base-border-color flows through --pc-border-color to a rendered border', async ({ page }) => {
    const borderColor = await page
        .locator('#border-el')
        .evaluate((el) => getComputedStyle(el).borderTopColor);
    expect(borderColor).toBe('rgb(0, 128, 0)');
});
