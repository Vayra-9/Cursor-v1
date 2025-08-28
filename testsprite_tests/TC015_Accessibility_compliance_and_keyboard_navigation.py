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
        # Assert all interactive elements have visible focus outlines and are reachable via keyboard
        interactive_elements = await page.query_selector_all('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
        assert len(interactive_elements) > 0, "No interactive elements found on the page."
        for element in interactive_elements:
            # Focus the element using keyboard navigation simulation
            await element.focus()
            # Check if the element is focused
            is_focused = await page.evaluate('(el) => el === document.activeElement', element)
            assert is_focused, f"Element {await element.get_attribute('outerHTML')} is not focusable via keyboard."
            # Check for visible focus outline (using computed style)
            outline_style = await page.evaluate('el => window.getComputedStyle(el).outlineStyle', element)
            assert outline_style != 'none', f"Element {await element.get_attribute('outerHTML')} does not have a visible focus outline."
        # Assert ARIA roles, labels, and states for screen reader accessibility
        for element in interactive_elements:
            role = await element.get_attribute('role')
            aria_label = await element.get_attribute('aria-label')
            aria_hidden = await element.get_attribute('aria-hidden')
            # Elements should have either a role or aria-label unless aria-hidden is true
            if aria_hidden != 'true':
                assert role or aria_label, f"Element {await element.get_attribute('outerHTML')} lacks role or aria-label for screen reader."
        # Run axe-core accessibility scan and confirm no critical violations
        from axe_playwright import AxeBuilder
        axe = AxeBuilder(page)
        results = await axe.analyze()
        critical_violations = [violation for violation in results['violations'] if violation['impact'] == 'critical']
        assert len(critical_violations) == 0, f"Critical accessibility violations found: {critical_violations}"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    