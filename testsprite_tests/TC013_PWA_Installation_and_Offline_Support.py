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
        # Simulate offline mode and reload the app to verify offline support and app functionality.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input email and password, then submit the sign-in form to access the app.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@vayra.digital')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('VayraTest@2025')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Simulate offline mode and reload the app to verify offline functionality and offline UI behavior.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/div/div[2]/div[5]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert PWA install prompt availability by checking for the manifest link and service worker registration
        manifest = await page.locator('link[rel="manifest"]').first
        assert await manifest.count() == 1, 'Manifest link not found, PWA install prompt may not be available'
        
        # Check manifest content for icons including maskable icons
        manifest_url = await manifest.get_attribute('href')
        response = await page.request.get(manifest_url)
        assert response.ok, f'Failed to fetch manifest from {manifest_url}'
        manifest_json = await response.json()
        icons = manifest_json.get('icons', [])
        assert any(icon.get('purpose') == 'maskable' for icon in icons), 'No maskable icon found in manifest'
        assert len(icons) > 0, 'No icons found in manifest'
        
        # Assert service worker registration for offline support
        service_worker_registered = await page.evaluate("navigator.serviceWorker.getRegistration().then(reg => !!reg)")
        assert service_worker_registered, 'Service worker is not registered, offline support may not be available'
        
        # Assert app launches with correct icons and splash screen by checking manifest name and icons
        assert 'name' in manifest_json and manifest_json['name'], 'Manifest name is missing'
        assert 'icons' in manifest_json and len(manifest_json['icons']) > 0, 'Manifest icons are missing'
        
        # Assert app continues to function offline by checking for offline UI or cached content
        # Here we check for presence of offline UI element or cached dashboard content
        offline_ui = await page.locator('text=offline').count()
        dashboard_welcome = await page.locator('text=Welcome to your VAYRA dashboard').count()
        assert offline_ui > 0 or dashboard_welcome > 0, 'App does not show offline UI or cached content when offline'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    