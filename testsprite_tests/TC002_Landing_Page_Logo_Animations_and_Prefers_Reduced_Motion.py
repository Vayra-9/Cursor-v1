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
        # Return to landing page and attempt to simulate prefers-reduced-motion setting via browser or page settings.
        await page.goto('http://localhost:5174', timeout=10000)
        

        # Simulate prefers-reduced-motion setting by injecting CSS media query override and observe hero logo animation behavior for accessibility compliance.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div/div/div/img').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert hero logo animations include fade, scale, and float loop effects
        hero_logo = page.locator('xpath=html/body/div/div/section/div/div/div/div/div/img').first
        # Check for animation properties in computed style
        animation_name = await hero_logo.evaluate('(el) => getComputedStyle(el).animationName')
        animation_duration = await hero_logo.evaluate('(el) => getComputedStyle(el).animationDuration')
        animation_iteration_count = await hero_logo.evaluate('(el) => getComputedStyle(el).animationIterationCount')
        assert 'fade' in animation_name or 'scale' in animation_name or 'float' in animation_name, 'Hero logo animation should include fade, scale, or float effects'
        assert animation_duration != '0s', 'Animation duration should not be zero'
        assert animation_iteration_count == 'infinite', 'Animation should loop infinitely'
        # Simulate prefers-reduced-motion enabled by injecting CSS to override animations
        await page.add_style_tag(content='@media (prefers-reduced-motion: reduce) { img { animation: none !important; transition: none !important; } }')
        # Wait a moment for styles to apply
        await page.wait_for_timeout(1000)
        # Verify animations are disabled or reduced
        animation_name_reduced = await hero_logo.evaluate('(el) => getComputedStyle(el).animationName')
        animation_duration_reduced = await hero_logo.evaluate('(el) => getComputedStyle(el).animationDuration')
        assert animation_name_reduced == 'none' or animation_duration_reduced == '0s', 'Animations should be disabled or reduced when prefers-reduced-motion is enabled'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    