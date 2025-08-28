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
        # Scroll down to check if hero logo is visible or if page content loads further down.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Reload the page to attempt to load content again and check for hero logo presence.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Reload the landing page and attempt to simulate or verify reduced-motion preference by alternative means, such as checking CSS or JS properties or using browser flags if accessible.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Simulate or verify user prefers-reduced-motion setting and reload the page to confirm animation is disabled or significantly reduced.
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Assert hero logo fade and scale animation completes smoothly without layout shift
        animation_completed = await page.evaluate("""() => {
          const logo = document.querySelector('img[src="/brand/vayra-logo.svg"]');
          return new Promise(resolve => {
            if (!logo) resolve(false);
            const animation = logo.getAnimations().find(anim => anim.effect.getKeyframes().some(kf => 'opacity' in kf && 'transform' in kf));
            if (!animation) resolve(false);
            animation.onfinish = () => resolve(true);
          });
        }""")
        assert animation_completed, 'Hero logo animation did not complete smoothly'
        
        # Assert no cumulative layout shift (CLS) greater than 0.1 during animation
        cls = await page.evaluate("""() => {
          return new Promise(resolve => {
            let clsValue = 0;
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (entry.value > clsValue) clsValue = entry.value;
              }
            }).observe({type: 'layout-shift', buffered: true});
            setTimeout(() => resolve(clsValue), 3000);
          });
        }""")
        assert cls <= 0.1, f'Cumulative Layout Shift too high: {cls}'
        
        # Enable prefers-reduced-motion and reload page to confirm animation is disabled or reduced
        await page.emulate_media({ reduced_motion: 'reduce' })
        await page.reload()
        animation_reduced = await page.evaluate("""() => {
          const logo = document.querySelector('img[src="/brand/vayra-logo.svg"]');
          if (!logo) return false;
          const animation = logo.getAnimations().find(anim => anim.effect.getKeyframes().some(kf => 'opacity' in kf && 'transform' in kf));
          if (!animation) return true;  // No animation means reduced motion respected
          return animation.playState === 'idle' || animation.playState === 'finished';
        }""")
        assert animation_reduced, 'Animation not disabled or reduced with prefers-reduced-motion'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    