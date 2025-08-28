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
        # Assert exactly one VAYRA logo is visible above the hero H1 headline
        logo_elements = await page.locator('img[alt="VAYRA logo"]').all()
        assert len(logo_elements) == 1, f"Expected exactly one VAYRA logo, found {len(logo_elements)}"
        logo = logo_elements[0]
        assert await logo.is_visible(), "VAYRA logo is not visible"
        # Check the position of the logo relative to the hero headline
        hero_headline = await page.locator('h1').first()
        logo_box = await logo.bounding_box()
        hero_box = await hero_headline.bounding_box()
        assert logo_box is not None and hero_box is not None, "Could not get bounding boxes for logo or hero headline"
        assert logo_box['y'] + logo_box['height'] <= hero_box['y'], "VAYRA logo is not above the hero headline"
        # Verify fade and scale animation on the logo
        # We check for CSS animation or transition properties on the logo element
        animation_name = await logo.evaluate('(el) => window.getComputedStyle(el).animationName')
        transition_property = await logo.evaluate('(el) => window.getComputedStyle(el).transitionProperty')
        assert animation_name != 'none' or transition_property != 'all', "Logo does not have fade or scale animation"
        # Ensure no cumulative layout shift (CLS) during and after animation
        # We measure layout shifts by checking bounding box changes over time
        initial_box = await logo.bounding_box()
        await page.wait_for_timeout(1000)  # wait for animation duration
        final_box = await logo.bounding_box()
        assert initial_box == final_box, "Layout shift detected during or after animation"]}  
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    