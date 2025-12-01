# E2E Testing

## Quick start

```bash
# one terminal
npm run dev

# second terminal
npm run test:e2e
```

## Headed mode

```bash
npm run test:e2e:ui
```

## Reports

* HTML: `npx playwright show-report`

## Environment

* Uses harmless Firebase defaults unless env secrets provided.
* Override base URL:

```bash
E2E_BASE_URL=https://preview.example.com npm run test:e2e
```

## Test Structure

### Core Tests
- **Smoke**: Basic app functionality, title, navigation
- **Homepage**: Hero section, CTA buttons, header visibility
- **Calculator**: Lite debt calculator functionality
- **Theme**: Theme toggle and persistence
- **Login**: Graceful handling of authentication flows
- **Pricing**: Pricing page and tier visibility
- **PWA**: Manifest and service worker validation

### Test Features
- **Cross-browser**: Chromium + Mobile Safari
- **Resilient selectors**: data-testid + role-based fallbacks
- **Graceful failures**: Soft assertions for missing elements
- **Console monitoring**: Filters out non-critical errors
- **Auto-start dev server**: No manual setup required

## CI/CD

GitHub Actions workflow runs on:
- Push to main
- Pull requests

Automatically:
- Installs dependencies
- Starts dev server
- Runs all tests
- Uploads reports as artifacts

## Data-TestID Hooks

Key elements have data-testid attributes for reliable testing:

```tsx
// Navigation
data-testid="nav-dashboard"
data-testid="nav-pricing"
data-testid="logo"

// CTAs
data-testid="cta-primary"

// Calculator
data-testid="calc-income"
data-testid="calc-expenses"
data-testid="calc-debt"
data-testid="disposable"
data-testid="payoff-estimate-months"

// Theme
data-testid="theme-toggle"
data-testid="toggle-theme-dark"
```

## Troubleshooting

### Common Issues

1. **Tests fail with connection refused**
   - Ensure dev server is running: `npm run dev`
   - Check port 5174 is available

2. **Firebase errors in console**
   - These are filtered out in tests
   - Add real Firebase env vars for full testing

3. **Theme toggle not working**
   - Check localStorage is accessible
   - Verify ThemeContext is properly configured

### Debug Mode

```bash
# Run with UI for debugging
npm run test:e2e:ui

# Run specific test
npx playwright test tests/e2e/smoke.spec.ts

# Run with headed browser
npx playwright test --headed
```

## Adding New Tests

1. Create test file in `tests/e2e/`
2. Use data-testid selectors when possible
3. Add graceful fallbacks for missing elements
4. Include both desktop and mobile scenarios
5. Update this documentation

## Performance

- Tests run in parallel (4 workers)
- Each test < 30 seconds
- Total suite < 2 minutes
- Screenshots/videos only on failure
