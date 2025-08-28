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
        # Reload the original app landing page and attempt to simulate prefers-reduced-motion via CSS or browser emulation if possible.
        await page.goto('http://localhost:5174', timeout=10000)
        

        # Scroll down to check for any animations or animated elements further down the landing page and observe their behavior.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Navigate to a page with known animations such as navigation transitions or hero animations to verify behavior with prefers-reduced-motion.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Fill in the sign-in form with provided credentials and sign in to reach a page with navigation transitions or animations to verify prefers-reduced-motion behavior.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test+vayra@demo.local')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TestVayra!234')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Simulate prefers-reduced-motion media query by injecting CSS to disable or simplify animations on this page, then interact with 'Get Started' buttons to observe any animation changes.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Inject CSS to simulate prefers-reduced-motion media query by disabling all animations and transitions on the upgrade plans page, then interact with elements to observe any changes.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Inject CSS to simulate prefers-reduced-motion by disabling all animations and transitions on this page, then observe if any animations or transitions are disabled or simplified.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the prefers-reduced-motion media query is respected by checking the computed style of the body or key animated elements for animation or transition properties.
        prefers_reduced_motion = await page.evaluate("""() => window.matchMedia('(prefers-reduced-motion: reduce)').matches""")
        assert prefers_reduced_motion, 'prefers-reduced-motion media query is not enabled or detected.'
        # Check that animations and transitions are disabled or simplified by verifying no animation or transition duration is set on key elements
        animated_elements = ["body", "div.hero-animation", "nav", "section", "div.animation"]  # example selectors for animated elements
        for selector in animated_elements:
            has_animation = await page.eval_on_selector(selector, "el => {
                const style = window.getComputedStyle(el);
                return (style.animationDuration !== '0s' && style.animationDuration !== '' ) || (style.transitionDuration !== '0s' && style.transitionDuration !== '');
            }")
            assert not has_animation, f'Animations or transitions are not disabled on element: {selector}'
        # Additional check: ensure no layout shifts or jank by checking for stable bounding boxes before and after a short wait
        for selector in animated_elements:
            box1 = await page.eval_on_selector(selector, "el => el.getBoundingClientRect()")
            await page.wait_for_timeout(1000)
            box2 = await page.eval_on_selector(selector, "el => el.getBoundingClientRect()")
            assert box1 == box2, f'Layout shift detected on element: {selector}'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    