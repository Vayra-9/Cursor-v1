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
        # Click on 'Start Your Journey' button to proceed to login or dashboard.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/section/div/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input email and password, then click Sign In button.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@vayra.digital')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('VayraTest@2025')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on AI chat widget button (index 18) to open the embedded AI chat and send a sample valid query.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input a sample valid query into the AI chat input box (index 24) and send it using the send button (index 25).
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[4]/form/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('What is the best way to pay off my debt?')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[4]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Navigate to the standalone AI chat page (/ai/chat) to test the AI copilot there.
        await page.goto('http://localhost:5174/ai/chat', timeout=10000)
        

        # Input email and password on sign-in page and click Sign In to proceed to AI chat page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@vayra.digital')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('VayraTest@2025')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click the AI chat widget button (index 18) to open the embedded AI chat and send a sample valid query.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input a sample valid query into the AI chat input box (index 24) and send it using the send button (index 25).
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[4]/form/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('What is the best way to pay off my debt?')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[4]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Navigate to the standalone AI chat page (/ai/chat) to test the AI copilot there.
        await page.goto('http://localhost:5174/ai/chat', timeout=10000)
        

        # Try to reload the standalone AI chat page to see if it loads correctly on refresh.
        await page.goto('http://localhost:5174/ai/chat', timeout=10000)
        

        # Input email and password, then click Sign In button to authenticate and access standalone AI chat page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@vayra.digital')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('VayraTest@2025')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click the AI Copilot button (index 18) to open the embedded AI chat and verify it loads and responds correctly.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input a valid query into the AI chat input box (index 24) and click the send button (index 25) to verify AI copilot response and UI stability.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[4]/form/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('How can I improve my budgeting skills?')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[4]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert AI chat widget response on dashboard page
        response_locator = frame.locator('xpath=html/body/div/div/div[3]/div[4]/div[contains(@class, "chat-response")]')
        await response_locator.wait_for(timeout=10000)
        response_text = await response_locator.inner_text()
        assert 'debt' in response_text.lower() or 'budget' in response_text.lower(), 'AI response on dashboard does not contain expected content.'
        # Navigate to standalone AI chat page and assert AI copilot response and UI stability
        await page.wait_for_timeout(3000)
        response_locator_standalone = frame.locator('xpath=html/body/div/div/div[3]/div[4]/div[contains(@class, "chat-response")]')
        await response_locator_standalone.wait_for(timeout=10000)
        response_text_standalone = await response_locator_standalone.inner_text()
        assert 'debt' in response_text_standalone.lower() or 'budget' in response_text_standalone.lower(), 'AI copilot response on standalone page does not contain expected content.'
        # Assert UI stability by checking the presence of input box and send button after response
        input_box = frame.locator('xpath=html/body/div/div/div[3]/div[4]/form/input').nth(0)
        send_button = frame.locator('xpath=html/body/div/div/div[3]/div[4]/form/button').nth(0)
        assert await input_box.is_visible(), 'AI chat input box is not visible after response.'
        assert await send_button.is_visible(), 'Send button is not visible after response.'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    