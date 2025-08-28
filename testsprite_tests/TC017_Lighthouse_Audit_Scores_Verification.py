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
        # Reload the landing page to check if content loads properly for Lighthouse audit.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Navigate to Dashboard page to prepare for Lighthouse audit there.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Fill in email and password fields and submit sign-in form to access Dashboard page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@vayra.digital')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('VayraTest@2025')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert Lighthouse audit scores for Landing page
        landing_scores = await run_lighthouse_audit(page, url='http://localhost:5174/')
        assert landing_scores['performance'] >= 90, f"Landing page performance score too low: {landing_scores['performance']}"
        assert landing_scores['accessibility'] >= 90, f"Landing page accessibility score too low: {landing_scores['accessibility']}"
        assert landing_scores['best-practices'] >= 90, f"Landing page best practices score too low: {landing_scores['best-practices']}"
        assert landing_scores['seo'] >= 90, f"Landing page SEO score too low: {landing_scores['seo']}"
          
        # Assert Lighthouse audit scores for Dashboard page
        dashboard_scores = await run_lighthouse_audit(page, url='http://localhost:5174/dashboard')
        assert dashboard_scores['performance'] >= 90, f"Dashboard page performance score too low: {dashboard_scores['performance']}"
        assert dashboard_scores['accessibility'] >= 90, f"Dashboard page accessibility score too low: {dashboard_scores['accessibility']}"
        assert dashboard_scores['best-practices'] >= 90, f"Dashboard page best practices score too low: {dashboard_scores['best-practices']}"
        assert dashboard_scores['seo'] >= 90, f"Dashboard page SEO score too low: {dashboard_scores['seo']}"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    