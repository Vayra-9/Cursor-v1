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
        # Enable system-wide reduced motion setting and verify logo animation respects reduced motion preference.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/header/div/div/div/div/div/button[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert exactly one VAYRA logo above the hero H1
        logo_locator = frame.locator('xpath=//header//img[contains(@alt, "VAYRA")]')
        hero_h1_locator = frame.locator('xpath=//h1[contains(text(), "VAYRA Debt Planner")]')
        assert await logo_locator.count() == 1, "Expected exactly one VAYRA logo"
        logo_box = await logo_locator.bounding_box()
        hero_box = await hero_h1_locator.bounding_box()
        assert logo_box and hero_box, "Logo or hero H1 bounding box not found"
        assert logo_box['y'] + logo_box['height'] <= hero_box['y'], "Logo is not above the hero H1"
        # Verify logo animation plays smoothly (fade+scale) by checking opacity and scale over time
        import asyncio
        opacity_1 = await logo_locator.evaluate('el => window.getComputedStyle(el).opacity')
        scale_1 = await logo_locator.evaluate('el => window.getComputedStyle(el).transform')
        await asyncio.sleep(0.5)
        opacity_2 = await logo_locator.evaluate('el => window.getComputedStyle(el).opacity')
        scale_2 = await logo_locator.evaluate('el => window.getComputedStyle(el).transform')
        assert opacity_1 != opacity_2 or scale_1 != scale_2, "Logo animation does not appear to play"
        # After enabling reduced motion, verify logo animation does not animate
        prefers_reduced_motion = await logo_locator.evaluate('el => window.matchMedia("(prefers-reduced-motion: reduce)").matches')
        assert prefers_reduced_motion, "Reduced motion preference not enabled"
        opacity_rm_1 = await logo_locator.evaluate('el => window.getComputedStyle(el).opacity')
        scale_rm_1 = await logo_locator.evaluate('el => window.getComputedStyle(el).transform')
        await asyncio.sleep(0.5)
        opacity_rm_2 = await logo_locator.evaluate('el => window.getComputedStyle(el).opacity')
        scale_rm_2 = await logo_locator.evaluate('el => window.getComputedStyle(el).transform')
        assert opacity_rm_1 == opacity_rm_2 and scale_rm_1 == scale_rm_2, "Logo animation should not play when reduced motion is enabled"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    