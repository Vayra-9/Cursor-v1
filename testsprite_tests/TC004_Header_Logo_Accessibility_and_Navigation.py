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
        # Click on the header logo to verify navigation to home page
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div/div/div/img').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Check if the header logo is wrapped inside a clickable link (anchor) element and try clicking that instead
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the header logo link to verify navigation to the home landing page
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the header logo is visible and has descriptive alt text
        header_logo = frame.locator('xpath=html/body/div/div/section/div/div/div/div/div/img').first
        assert await header_logo.is_visible(), 'Header logo should be visible'
        alt_text = await header_logo.get_attribute('alt')
        assert alt_text and len(alt_text.strip()) > 0, 'Header logo should have descriptive alt text'
          
        # Assert that the header logo receives focus and shows visible focus outline when tabbed to
        await frame.keyboard.press('Tab')
        focused_element = await frame.evaluate('document.activeElement')
        focused_tag = await frame.evaluate('document.activeElement.tagName')
        assert focused_tag.lower() == 'img' or focused_tag.lower() == 'a', 'Focused element should be the header logo or its link'
        # Check for visible focus outline style (outline or box-shadow)
        focus_outline = await frame.evaluate("window.getComputedStyle(document.activeElement).outlineStyle")
        assert focus_outline != 'none', 'Header logo should have visible focus outline when focused'
          
        # Click on the header logo and verify navigation to home landing page
        await header_logo.click()
        await frame.wait_for_load_state('load')
        current_url = frame.url
        assert current_url.endswith('/') or current_url.endswith('/home'), 'Clicking header logo should navigate to home page'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    