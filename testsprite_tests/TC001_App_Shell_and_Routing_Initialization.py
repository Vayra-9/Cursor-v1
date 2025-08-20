import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5174", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Check console for errors and verify if any elements are hidden or if the page needs scrolling to reveal navigation links
        await page.mouse.wheel(0, window.innerHeight)
        

        # Try to reload the page to see if the app shell loads correctly
        await page.goto('http://localhost:5174', timeout=10000)
        

        # Click on the top navigation links Home, Dashboard, Pricing, and Login one by one to verify routing and page loads.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Click on Pricing link to verify routing and page load
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div[2]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Navigate back to home and then click on Home link to verify routing and page load
        await page.goto('http://localhost:5174', timeout=10000)
        

        # Verify if Home navigation link is clickable and leads to home page or reload home page if no explicit Home link found.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Navigate to the Dashboard page to verify routing and page load
        await page.goto('http://localhost:5174/dashboard', timeout=10000)
        

        # Navigate to a non-existing route (e.g., /nonexistentpage) to verify the 404 page displays correctly
        await page.goto('http://localhost:5174/nonexistentpage', timeout=10000)
        

        # Check header and footer presence and accessibility on home, pricing, and login pages to complete UI/UX verification.
        await page.goto('http://localhost:5174', timeout=10000)
        

        # Navigate to Pricing page and check header and footer presence and accessibility
        await page.goto('http://localhost:5174/pricing', timeout=10000)
        

        # Navigate to Login page and check header and footer presence and accessibility
        await page.goto('http://localhost:5174/signin', timeout=10000)
        

        # Assert the app shell loads correctly by checking the page title
        assert 'VAYRA - Debt Management & Income Platform' in await page.title()
        # Assert header is visible and contains expected text
        header_locator = page.locator('header')
        assert await header_locator.is_visible()
        assert 'Welcome Back' in await header_locator.inner_text()
        # Assert footer is visible
        footer_locator = page.locator('footer')
        assert await footer_locator.is_visible()
        # Assert navigation links are present and clickable
        nav_links = ['Home', 'Dashboard', 'Pricing', 'Login']
        for link_text in nav_links:
            link = page.locator(f'nav >> text={link_text}')
            assert await link.is_visible()
            await link.click()
            # Wait for navigation to complete
            await page.wait_for_load_state('networkidle')
            # Basic check: page title or header changes after navigation
            assert await page.title() != ''
        # Navigate to a non-existing route and verify 404 page is displayed
        await page.goto('http://localhost:5174/nonexistentpage')
        not_found_text = await page.locator('text=404').inner_text()
        assert '404' in not_found_text or 'not found' in not_found_text.lower()
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    