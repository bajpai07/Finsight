import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Go to the app
            await page.goto("http://localhost:3000")

            # Handle login
            await page.get_by_placeholder("admin").first.fill("admin")
            await page.get_by_placeholder("admin").last.fill("admin")
            await page.get_by_role("button", name="Login").click()

            # Wait for the main dashboard to load by looking for a known element
            await expect(page.get_by_text("FinSight360")).to_be_visible(timeout=10000)

            # Find the "Add Funds" button and click it
            add_funds_button = page.get_by_role("button", name="Add Funds")
            await expect(add_funds_button).to_be_visible()
            await add_funds_button.click()

            # Wait for the modal to appear
            modal = page.get_by_text("Add Funds to Your Account")
            await expect(modal).to_be_visible()

            # Take a screenshot of the payment modal
            await page.screenshot(path="jules-scratch/verification/payment_modal.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            # Save a screenshot on error for debugging
            await page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
