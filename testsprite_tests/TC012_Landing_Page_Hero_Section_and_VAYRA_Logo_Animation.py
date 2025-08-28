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
        # Scroll down or try to interact with the page to reveal the hero section and VAYRA logo.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Try to reload the page or check for any interactive elements or buttons that might reveal the hero section.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Resize viewport to tablet size and verify the logo's crispness, animation, and layout.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Resize viewport to tablet size and verify the logo's crispness, animation, and layout.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Resize viewport to tablet size and verify the logo's crispness, animation, and layout.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Resize viewport to tablet size and verify the logo's crispness, animation, and layout.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Resize viewport to tablet size and verify the logo's crispness, animation, and layout.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Assert the VAYRA logo is present, crisp, and animated on desktop viewport
        logo = await page.locator('img[alt="VAYRA logo"]')
        assert await logo.count() == 1, 'There should be exactly one VAYRA logo on the page'
        box = await logo.bounding_box()
        assert box is not None, 'Logo bounding box should be available'
        assert box['width'] > 0 and box['height'] > 0, 'Logo should have non-zero dimensions'
        # Check for animation by verifying the presence of animation-related CSS properties
        animation_name = await logo.evaluate('(el) => window.getComputedStyle(el).getPropertyValue("animation-name")')
        assert animation_name != 'none', 'Logo should have an animation applied'
        # Resize to tablet viewport and verify logo scales and animates properly
        await page.set_viewport_size({'width': 768, 'height': 1024})
        tablet_box = await logo.bounding_box()
        assert tablet_box is not None, 'Logo bounding box should be available on tablet'
        assert tablet_box['width'] > 0 and tablet_box['height'] > 0, 'Logo should have non-zero dimensions on tablet'
        tablet_animation_name = await logo.evaluate('(el) => window.getComputedStyle(el).getPropertyValue("animation-name")')
        assert tablet_animation_name != 'none', 'Logo should have an animation applied on tablet'
        # Resize to mobile viewport and verify logo scales and animates properly
        await page.set_viewport_size({'width': 375, 'height': 667})
        mobile_box = await logo.bounding_box()
        assert mobile_box is not None, 'Logo bounding box should be available on mobile'
        assert mobile_box['width'] > 0 and mobile_box['height'] > 0, 'Logo should have non-zero dimensions on mobile'
        mobile_animation_name = await logo.evaluate('(el) => window.getComputedStyle(el).getPropertyValue("animation-name")')
        assert mobile_animation_name != 'none', 'Logo should have an animation applied on mobile'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    