import { test, expect } from '@playwright/test';

test.describe('Smoke - Navegacao principal', () => {
  test('carrega home com menu principal', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Chess XGR/i);
    await expect(page.getByRole('heading', { name: 'Chess XGR' })).toBeVisible();
    await expect(page.getByTestId('menu-play-ai')).toBeVisible();
  });

  test('entra no jogo vs IA e exibe paineis essenciais', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('menu-play-ai').click();

    await expect(page.getByTestId('game-board-area')).toBeVisible();
    await expect(page.getByTestId('chess-board')).toBeVisible();
    await expect(page.getByTestId('game-controls-panel')).toBeVisible();
    await expect(page.getByTestId('emotional-indicator')).toBeVisible();
    await expect(page.getByTestId('move-history-panel')).toBeVisible();
  });

  test('exibe controles basicos de partida no painel lateral', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('menu-play-ai').click();

    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reiniciar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Desfazer' })).toBeVisible();
  });
});
