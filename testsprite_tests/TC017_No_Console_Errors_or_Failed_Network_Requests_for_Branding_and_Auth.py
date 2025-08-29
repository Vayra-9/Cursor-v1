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
        # Click 'Start Your Journey' to navigate to authentication/login page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input email and password, then click 'Sign In' button to proceed to dashboard.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@vayra.digital')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('VayraTest@2025')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Navigate to PWA install flow and verify no console errors or failed network requests.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/div/div[2]/div[5]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Trigger or navigate to the PWA install flow to verify no console errors or failed network requests during PWA installation.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/main/div/div/div/div/div[4]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert no console errors or warnings during navigation and usage
        console_messages = []
        page.on('console', lambda msg: console_messages.append(msg))
        await page.wait_for_timeout(1000)  # Wait a bit to collect console messages
        assert all(msg.type() != 'error' and msg.type() != 'warning' for msg in console_messages), f'Console errors or warnings found: {[msg.text() for msg in console_messages if msg.type() in ["error", "warning"]]}'
          
        # Assert no failed network requests for branding SVGs, authentication backend APIs, or PWA service worker assets
        failed_requests = []
        def check_request(request):
            url = request.url
            if any(keyword in url for keyword in ['branding', 'auth', 'service-worker', 'pwa']):
                request.failed() and failed_requests.append(request)
        page.on('requestfailed', check_request)
        await page.wait_for_timeout(1000)  # Wait a bit to catch failed requests
        assert len(failed_requests) == 0, f'Failed network requests found: {[req.url for req in failed_requests]}'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    