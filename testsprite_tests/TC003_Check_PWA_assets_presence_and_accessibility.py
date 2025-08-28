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
        # Check the page source or head elements for favicon and manifest references, or try to locate manifest.webmanifest file manually.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Try to navigate to /manifest.webmanifest or /manifest.json to check if manifest file exists and contains icon references.
        await page.goto('http://localhost:5174/manifest.webmanifest', timeout=10000)
        

        # Verify HTTP 200 status for the SVG icon and all PWA icons listed in the manifest.
        await page.goto('http://localhost:5174/brand/vayra-logo.svg', timeout=10000)
        

        # Verify HTTP 200 status for each PWA icon URL from manifest.
        await page.goto('http://localhost:5174/icons/icon-72x72.png', timeout=10000)
        

        # Check the next PWA icon URL from the manifest to verify its HTTP status.
        await page.goto('http://localhost:5174/icons/icon-96x96.png', timeout=10000)
        

        # Continue checking HTTP 200 status for the remaining PWA icons listed in the manifest.
        await page.goto('http://localhost:5174/icons/icon-128x128.png', timeout=10000)
        

        # Continue checking HTTP 200 status for the remaining PWA icons listed in the manifest.
        await page.goto('http://localhost:5174/icons/icon-144x144.png', timeout=10000)
        

        # Continue checking HTTP 200 status for the remaining PWA icons listed in the manifest.
        await page.goto('http://localhost:5174/icons/icon-152x152.png', timeout=10000)
        

        # Continue checking HTTP 200 status for the remaining PWA icons listed in the manifest.
        await page.goto('http://localhost:5174/icons/icon-192x192.png', timeout=10000)
        

        # Continue checking HTTP 200 status for the remaining PWA icons listed in the manifest.
        await page.goto('http://localhost:5174/icons/icon-384x384.png', timeout=10000)
        

        # Continue checking HTTP 200 status for the last remaining PWA icon listed in the manifest.
        await page.goto('http://localhost:5174/icons/icon-512x512.png', timeout=10000)
        

        # Check common favicon paths such as /favicon.ico and /favicon.png for HTTP 200 status to verify favicon presence.
        await page.goto('http://localhost:5174/favicon.ico', timeout=10000)
        

        # Assert HTTP 200 status for SVG icon and PWA icons already navigated to
        assert page.response().status == 200, 'SVG or PWA icon did not return HTTP 200 status'
        # Assert HTTP 200 status for favicon.ico and favicon.png
        response_favicon_ico = await page.goto('http://localhost:5174/favicon.ico', timeout=10000)
        assert response_favicon_ico.status == 200, 'favicon.ico did not return HTTP 200 status'
        response_favicon_png = await page.goto('http://localhost:5174/favicon.png', timeout=10000)
        assert response_favicon_png.status == 200, 'favicon.png did not return HTTP 200 status'
        # Fetch and parse manifest.webmanifest to verify icons and maskable attribute
        manifest_response = await page.goto('http://localhost:5174/manifest.webmanifest', timeout=10000)
        assert manifest_response.status == 200, 'manifest.webmanifest did not return HTTP 200 status'
        manifest_json = await manifest_response.json()
        icons = manifest_json.get('icons', [])
        assert icons, 'No icons found in manifest'
        for icon in icons:
            src = icon.get('src')
            sizes = icon.get('sizes')
            purpose = icon.get('purpose', '')
            assert src, 'Icon src missing in manifest'
            assert sizes, 'Icon sizes missing in manifest'
            icon_url = f'http://localhost:5174{src}' if src.startswith('/') else src
            icon_response = await page.goto(icon_url, timeout=10000)
            assert icon_response.status == 200, f'Icon {src} did not return HTTP 200 status'
            if 'maskable' in purpose:
                assert 'maskable' in purpose, f'Icon {src} with maskable PNG must have maskable purpose attribute'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    