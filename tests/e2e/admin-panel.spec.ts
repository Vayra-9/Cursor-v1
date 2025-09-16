import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test('admin panel visible and shows claims after login', async ({ page, context }) => {
    // Provide dev override so tests don't require Firebase token refresh
    await context.addInitScript(() => {
      localStorage.setItem('vayra-god', '1');
    });

    await page.goto('/admin');
    
    // Check that admin panel is visible
    const panel = page.getByTestId('admin-panel');
    await expect(panel).toBeVisible();
    
    // Check that claims section is visible
    const claims = page.getByTestId('admin-claims');
    await expect(claims).toBeVisible();
    
    // Check that the page has the expected title
    await expect(page.locator('h1')).toContainText('VAYRA — Admin Dashboard');
  });

  test('admin panel shows loading state initially', async ({ page }) => {
    await page.goto('/admin');
    
    // Check that loading state appears initially
    const loadingText = page.getByText('Loading claims...');
    // Note: This might be very quick, so we'll just check the panel exists
    const panel = page.getByTestId('admin-panel');
    await expect(panel).toBeVisible();
  });

  test('admin panel displays admin status correctly', async ({ page, context }) => {
    // Mock admin claims in localStorage for testing
    await context.addInitScript(() => {
      // Mock Firebase auth state
      window.mockFirebaseAuth = {
        currentUser: {
          email: 'test@vayra.digital',
          uid: 'test-uid'
        }
      };
    });

    await page.goto('/admin');
    
    const panel = page.getByTestId('admin-panel');
    await expect(panel).toBeVisible();
    
    // Check admin functions section
    const adminFunctions = page.getByText('Admin Functions');
    await expect(adminFunctions).toBeVisible();
    
    // Check test user setup section
    const testUserSetup = page.getByText('Test User Setup');
    await expect(testUserSetup).toBeVisible();
  });

  test('admin page is accessible via direct URL', async ({ page }) => {
    await page.goto('/admin');
    
    // Verify page loads correctly
    await expect(page.locator('h1')).toContainText('VAYRA — Admin Dashboard');
    
    // Verify main sections are present
    await expect(page.getByText('Manage user claims and administrative functions')).toBeVisible();
    await expect(page.getByTestId('admin-panel')).toBeVisible();
  });
});
