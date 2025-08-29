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
        hero_h1_locator = frame.locator('xpath=//h1[contains(text(), "VAYRA")]')
        assert await logo_locator.count() == 1, "There should be exactly one VAYRA logo."
        logo_box = await logo_locator.bounding_box()
        hero_h1_box = await hero_h1_locator.bounding_box()
        assert logo_box and hero_h1_box, "Logo or hero H1 bounding box not found."
        assert logo_box['y'] + logo_box['height'] <= hero_h1_box['y'], "Logo should be above the hero H1."
        # Verify logo animation plays smoothly (fade+scale)
        # We check for presence of animation styles or classes and that reduced motion is not enabled
        animation_classes = await logo_locator.evaluate("el => el.classList.toString()")
        reduced_motion = await frame.evaluate("window.matchMedia('(prefers-reduced-motion: reduce)').matches")
        assert 'fade' in animation_classes and 'scale' in animation_classes, "Logo should have fade and scale animation classes."
        assert reduced_motion is False, "Reduced motion should be disabled for animation to play."
        # After enabling reduced motion, verify logo animation does not animate
        await frame.locator('xpath=html/body/div/div/header/div/div/div/div/div/button[3]').click()
        reduced_motion_after = await frame.evaluate("window.matchMedia('(prefers-reduced-motion: reduce)').matches")
        assert reduced_motion_after is True, "Reduced motion should be enabled after clicking the button."
        animation_classes_after = await logo_locator.evaluate("el => el.classList.toString()")
        assert 'fade' not in animation_classes_after and 'scale' not in animation_classes_after, "Logo animation should be disabled when reduced motion is enabled."
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    