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
        # Scroll down or try to find the hero section or logo animation elements to verify fade and scale effects.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Try to reload the page or check for any UI elements or settings that might reveal the hero section or logo animation.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Manually enable prefers-reduced-motion setting in the browser or device if possible, or simulate the setting if environment allows, then reload the landing page to verify animation reduction.
        await page.goto('http://localhost:5174', timeout=10000)
        

        # Simulate enabling prefers-reduced-motion setting and reload the page to verify animation reduction or disablement.
        await page.goto('about:preferences#accessibility', timeout=10000)
        

        # Return to the landing page and attempt to simulate prefers-reduced-motion setting or document inability to toggle it programmatically.
        await page.goto('http://localhost:5174', timeout=10000)
        

        # Simulate prefers-reduced-motion setting if possible or document inability to toggle it programmatically, then verify logo animation behavior.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Assert that the logo animation includes fade and scale effects by checking CSS transition properties on the logo element
        logo = await page.query_selector('header .logo, .hero .logo, #logo')  # Adjust selector as needed
        assert logo is not None, 'Logo element not found for animation check'
        # Check computed styles for transition properties related to opacity and transform
        computed_style = await page.evaluate('(element) => window.getComputedStyle(element)', logo)
        transition_property = await page.evaluate('(element) => window.getComputedStyle(element).transitionProperty', logo)
        assert 'opacity' in transition_property and 'transform' in transition_property, 'Logo animation does not include fade and scale transitions'
        # Check that animation runs smoothly by waiting for transition end event
        animation_completed = await page.evaluate('''(element) => {
          return new Promise(resolve => {
            element.addEventListener('transitionend', resolve, {once: true});
          });
        }''', logo)
        assert animation_completed is None, 'Logo animation transition did not complete smoothly'
        # Check prefers-reduced-motion setting and verify animation is reduced or disabled
        prefers_reduced_motion = await page.evaluate('window.matchMedia("(prefers-reduced-motion: reduce)").matches')
        if prefers_reduced_motion:
            # When reduced motion is preferred, check that transitions are disabled or minimal
            transition_duration = await page.evaluate('(element) => window.getComputedStyle(element).transitionDuration', logo)
            # transitionDuration can be '0s' or very small
            assert transition_duration == '0s' or transition_duration == '0ms', 'Animations are not reduced or disabled despite prefers-reduced-motion setting'
        else:
            # If no reduced motion preference, ensure transitions exist
            assert 'opacity' in transition_property and 'transform' in transition_property, 'Animations missing when no reduced motion preference'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    