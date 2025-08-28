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
        # Locate both VAYRA logo SVG elements on the page, check their dimensions, and identify which one is duplicate to remove it.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Click to remove or hide the second VAYRA logo image to ensure only one logo is displayed above the hero H1, then verify the remaining logo's size visually or by CSS.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div/div/div/img').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Try to locate another clickable element or container that can remove or hide the duplicate VAYRA logo image, or use a different method to ensure only one logo is displayed above the hero H1.
        await page.mouse.wheel(0, -window.innerHeight)
        

        await page.mouse.wheel(0, window.innerHeight)
        

        # Inject CSS to hide the second VAYRA logo image to ensure only one logo is displayed above the hero H1, then verify the remaining logo's size visually or by CSS.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div/div/div/img').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Inject CSS to hide the second VAYRA logo image to ensure only one logo is displayed above the hero H1, then verify the remaining logo's size visually or by CSS.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Assert exactly one VAYRA logo SVG is displayed above the hero H1
        logo_svgs = await page.locator('xpath=//h1[contains(text(), "VAYRA")]/preceding::svg[contains(@class, "vayra-logo")]').all()
        assert len(logo_svgs) == 1, f"Expected exactly one VAYRA logo SVG above hero H1, found {len(logo_svgs)}"
        # Check the logo dimensions (width and height) to match specifications (e.g., width and height >= 96px)
        logo_box = await logo_svgs[0].bounding_box()
        assert logo_box is not None, "Logo bounding box not found"
        assert logo_box['width'] >= 96 and logo_box['height'] >= 96, f"Logo size is smaller than expected: {logo_box}"
        # Ensure no duplicate logos are present on the entire page
        all_logos = await page.locator('svg.vayra-logo').all()
        assert len(all_logos) == 1, f"Duplicate logos found on the page: {len(all_logos)}"]}]}]}
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    