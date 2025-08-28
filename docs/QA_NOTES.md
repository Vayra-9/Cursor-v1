# QA Notes

## Lighthouse Testing Scope

### Recommended Test Pages
- **Homepage (`/`)**: Test core landing page performance and accessibility
- **Dashboard (`/dashboard`)**: Test authenticated user experience and app performance

### Pages to Avoid for Lighthouse Testing
- **Authentication pages** (`/signin`, `/signup`, `/auth/sign-in`, `/auth/sign-up`): These pages contain reCAPTCHA which can interfere with Lighthouse testing and cause false failures.

### Testing Considerations

#### Google OAuth Testing
- Test both popup and redirect flows
- Verify fallback behavior when popup is blocked
- Check redirect result handling on app initialization

#### Plan Gating
- Verify free users are redirected to `/upgrade`
- Confirm starter+ users can access dashboard
- Test plan enforcement across all protected routes

#### Currency Selector
- Test local storage persistence
- Verify no backend dependencies
- Check functionality without authentication

#### Error Boundary Testing
- Use `/dev/error` route (development only) to test error boundary behavior
- Verify graceful error handling and user feedback

#### Navigation Wiring
- Confirm logo links to `/`
- Verify upgrade page "Get Started" links to `/auth/sign-up`
- Test "Back to Dashboard" functionality

### Performance Benchmarks
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios

### Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
