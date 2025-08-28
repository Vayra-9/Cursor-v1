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
        # Navigate to the next major app route to check for branding assets and 404 errors.
        await page.goto('http://localhost:5174/dashboard', timeout=10000)
        

        # Navigate to the dashboard page to check for branding assets and 404 errors, and inspect manifest files for favicon and PWA icon references.
        await page.goto('http://localhost:5174/dashboard', timeout=10000)
        

        # Navigate to the dashboard page to check for branding assets and 404 errors, and inspect manifest files for favicon and PWA icon references.
        await page.goto('http://localhost:5174/dashboard', timeout=10000)
        

        # Navigate to the dashboard page to check for branding assets and 404 errors, and inspect manifest files for favicon and PWA icon references.
        await page.goto('http://localhost:5174/dashboard', timeout=10000)
        

        # Navigate to the dashboard page to check for branding assets and 404 errors, and inspect manifest files for favicon and PWA icon references.
        await page.goto('http://localhost:5174/dashboard', timeout=10000)
        

        # Navigate to the home page or another major app route to check for branding assets and 404 errors, and inspect manifest files for favicon and PWA icon references.
        await page.goto('http://localhost:5174/home', timeout=10000)
        

        # Navigate to another major app route or inspect manifest files for favicon and PWA icon references.
        await page.goto('http://localhost:5174/dashboard', timeout=10000)
        

        # Assert no 404 errors or loading errors in console for brand assets
        console_messages = []
        page.on('console', lambda msg: console_messages.append(msg))
        # Wait for network idle to ensure all assets are loaded
        await page.wait_for_load_state('networkidle')
        # Check console messages for 404 or error related to brand assets
        assert not any('404' in msg.text or 'favicon' in msg.text or 'logo' in msg.text or 'icon' in msg.text for msg in console_messages), 'Found 404 or loading errors for brand assets in console'
        # Visually confirm presence of SVG logos, favicons, and PWA icons
        # Check for SVG logos in the page
        svg_logos = await page.query_selector_all('img[src$=".svg"], svg')
        assert len(svg_logos) > 0, 'No SVG logos found on the page'
        # Check for favicon link in head
        favicon_link = await page.query_selector('link[rel="icon"], link[rel="shortcut icon"]')
        assert favicon_link is not None, 'Favicon link not found in the page head'
        # Check for PWA manifest link and icons
        manifest_link = await page.query_selector('link[rel="manifest"]')
        assert manifest_link is not None, 'PWA manifest link not found in the page head'
        manifest_url = await manifest_link.get_attribute('href')
        assert manifest_url is not None, 'Manifest href attribute is missing'
        # Fetch and validate manifest content
        manifest_response = await page.request.get(manifest_url)
        assert manifest_response.ok, f'Failed to fetch manifest file from {manifest_url}'
        manifest_json = await manifest_response.json()
        assert 'icons' in manifest_json and len(manifest_json['icons']) > 0, 'No icons found in PWA manifest'
        # Check that icons in manifest have valid src and sizes
        for icon in manifest_json['icons']:
            assert 'src' in icon and icon['src'], 'Icon src missing in manifest icon entry'
            assert 'sizes' in icon and icon['sizes'], 'Icon sizes missing in manifest icon entry'
        # Optionally, check that icons are accessible (no 404)
            icon_url = icon['src']
            if not icon_url.startswith('http'):
                from urllib.parse import urljoin
                icon_url = urljoin(manifest_url, icon_url)
            icon_response = await page.request.get(icon_url)
            assert icon_response.ok, f'Icon URL {icon_url} returned status {icon_response.status}'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    