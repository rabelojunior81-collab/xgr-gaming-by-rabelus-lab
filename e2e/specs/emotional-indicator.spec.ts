import { test, expect } from '@playwright/test';

test.describe('EmotionalIndicator', () => {
  test('renderiza no modo pratica vs IA', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('menu-play-ai').click();

    const indicator = page.getByTestId('emotional-indicator');
    await expect(indicator).toBeVisible();
    await expect(indicator).toContainText(/Confiante|Otimista|Neutro|Preocupado|Desesperado/i);
  });

  test('mantem painel emocional visivel apos toggles da UI', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('menu-play-ai').click();

    await page.getByRole('button', { name: 'Dicas' }).click();
    await page.getByRole('button', { name: 'Análise' }).click();

    await expect(page.getByTestId('emotional-indicator-panel')).toBeVisible();
    await expect(page.getByTestId('emotional-indicator')).toBeVisible();
  });
});
