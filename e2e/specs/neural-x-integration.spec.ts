import { test, expect } from '@playwright/test';

test.describe('Neural-X - Integracao base', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('menu-play-ai').click();
  });

  test('carrega componentes centrais da experiencia vs IA', async ({ page }) => {
    await expect(page.getByTestId('chess-board')).toBeVisible();
    await expect(page.getByTestId('game-controls-panel')).toBeVisible();
    await expect(page.getByTestId('emotional-indicator')).toBeVisible();
    await expect(page.getByTestId('move-history-list')).toBeVisible();
  });

  test('abre e fecha modal de reinicio sem quebrar estado da UI', async ({ page }) => {
    await page.getByRole('button', { name: 'Reiniciar' }).click();

    await expect(page.getByText('Reiniciar partida?')).toBeVisible();
    await page.getByRole('button', { name: 'Não' }).click();
    await expect(page.getByText('Reiniciar partida?')).not.toBeVisible();

    await expect(page.getByTestId('emotional-indicator')).toBeVisible();
    await expect(page.getByTestId('chess-board')).toBeVisible();
  });
});
