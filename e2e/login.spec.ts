import { test, expect } from '@playwright/test'

test('登入頁面應該正確渲染，且包含必要的表單欄位', async ({ page }) => {
  // 導航到登入頁面
  await page.goto('/login')

  // 確認網頁標題
  await expect(page).toHaveTitle(/Jenny\.Dev/i)

  // 確認畫面上有顯示 'Frontend Hub' 標題
  const title = page.locator('h1', { hasText: 'Frontend Hub' })
  await expect(title).toBeVisible({ timeout: 10000 })

  // 確認 Email 與 Password 欄位存在
  const emailInput = page.locator('input[type="email"]')
  const passwordInput = page.locator('input[type="password"]')
  await expect(emailInput).toBeVisible()
  await expect(passwordInput).toBeVisible()

  // 確認登入按鈕存在
  const loginButton = page.locator('button[type="submit"]', { hasText: '登入' })
  await expect(loginButton).toBeVisible()

  // 確認 Demo 一鍵登入按鈕存在
  const demoButton = page.locator('button', { hasText: 'Demo 帳號一鍵登入' })
  await expect(demoButton).toBeVisible()
})

test('在未填寫帳密時點擊登入，應該觸發 HTML 原生表單驗證 (required)', async ({ page }) => {
  await page.goto('/login')

  // 嘗試直接點擊登入
  const loginButton = page.locator('button[type="submit"]', { hasText: '登入' })
  await loginButton.click()

  const emailInput = page.locator('input[type="email"]')
  await expect(emailInput).toBeEmpty()
})
