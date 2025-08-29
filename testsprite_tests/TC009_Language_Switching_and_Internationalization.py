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
        # Click on the language selector button to open language options
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/header/div/div/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Select 'Español' language option to change UI language
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/header/div/div/div/div[3]/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Refresh the page to verify language preference persistence and UI localization remains in Spanish
        await page.goto('http://localhost:5174/', timeout=10000)
        

        # Assert that UI text is updated to Spanish immediately after language change
        spanish_texts = [
            'Transforma tu futuro financiero con la gestión de deuda impulsada por IA',
            'Análisis inteligente de deuda',
            'Seguimiento visual del progreso',
            'Seguro y privado',
            'Resultados comprobados',
            'Únete a más de 50K usuarios que han pagado más de $2.5M en deuda',
            'Comienza tu viaje',
            'Ver planes',
            'Comienza gratis'
            ]
        for text in spanish_texts:
            assert await page.locator(f'text={text}').is_visible(), f"Expected Spanish text '{text}' to be visible after language change"
          
        # Refresh the page to verify language preference persistence and UI localization remains in Spanish
        await page.reload()
        for text in spanish_texts:
            assert await page.locator(f'text={text}').is_visible(), f"Expected Spanish text '{text}' to persist after page reload"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    