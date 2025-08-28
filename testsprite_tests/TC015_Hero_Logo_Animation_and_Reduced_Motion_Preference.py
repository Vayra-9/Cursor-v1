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
        # Enable OS-level reduced motion setting and reload the landing page to verify animations respect user preference
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/header/div/div/div/div/div/button[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Assertion: Verify animations are reduced or disabled in accordance with OS reduced motion preference
        hero_logo = frame.locator('header div.hero-logo')
        # Check for CSS properties or classes that indicate reduced motion preference is respected
        # For example, check if animation-play-state is paused or animation duration is 0
        animation_play_state = await hero_logo.evaluate('(el) => window.getComputedStyle(el).getPropertyValue("animation-play-state")')
        animation_duration = await hero_logo.evaluate('(el) => window.getComputedStyle(el).getPropertyValue("animation-duration")')
        assert animation_play_state in ['paused', 'none'], f"Expected animation-play-state to be 'paused' or 'none', got {animation_play_state}"
        assert animation_duration == '0s', f"Expected animation-duration to be '0s', got {animation_duration}"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    