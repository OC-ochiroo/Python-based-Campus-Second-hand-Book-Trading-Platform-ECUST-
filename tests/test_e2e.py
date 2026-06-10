import pytest
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"
SCREENSHOTS_DIR = "tests/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

# --- Real registered user for TC-03 ---
VALID_EMAIL = "test@university.edu"
VALID_PASSWORD = "password123"


@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # uncomment to run without a browser window
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    d = webdriver.Chrome(options=options)
    d.set_window_size(1280, 800)
    yield d
    d.quit()


def screenshot(driver, name):
    driver.save_screenshot(f"{SCREENSHOTS_DIR}/{name}.png")


# TC-01: Homepage loads with Book2Go title and CTA button
def test_homepage_loads(driver):
    driver.get(BASE_URL)
    wait = WebDriverWait(driver, 5)

    # Navbar logo says "Book2Go"
    logo = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "navbar__logo")))
    assert "Book2Go" in logo.text

    # CTA button exists
    cta = driver.find_element(By.CLASS_NAME, "home__cta")
    assert cta.is_displayed()

    screenshot(driver, "TC-01_homepage")


# TC-02: Clicking 'Log in' navigates to /login
def test_login_nav(driver):
    driver.get(BASE_URL)
    wait = WebDriverWait(driver, 5)

    login_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Log in']")))
    login_btn.click()

    wait.until(EC.url_contains("/login"))
    assert "/login" in driver.current_url

    screenshot(driver, "TC-02_login_nav")


# TC-03: Submitting valid credentials redirects to /feed
def test_valid_login_redirects_to_feed(driver):
    driver.get(f"{BASE_URL}/login")
    wait = WebDriverWait(driver, 5)

    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
    driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys(VALID_EMAIL)
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(VALID_PASSWORD)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(EC.url_contains("/feed"))
    assert "/feed" in driver.current_url

    screenshot(driver, "TC-03_valid_login")


# TC-04: Unauthenticated access to /feed redirects to /login
def test_unauthenticated_feed_redirects(driver):
    # Fresh driver has no user in React state — AuthContext starts as null
    driver.get(f"{BASE_URL}/feed")
    wait = WebDriverWait(driver, 5)

    wait.until(EC.url_contains("/login"))
    assert "/login" in driver.current_url

    screenshot(driver, "TC-04_unauth_redirect")


# TC-05: Register form shows inline errors for invalid input
def test_register_validation_errors(driver):
    driver.get(f"{BASE_URL}/register")
    wait = WebDriverWait(driver, 5)

    # Submit with all fields empty
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']")))
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    # Zod validation fires client-side — errors appear immediately
    errors = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "auth__error")))
    assert len(errors) >= 1

    # Check a specific message
    messages = [e.text for e in errors]
    assert any("required" in m.lower() or "invalid" in m.lower() for m in messages)

    screenshot(driver, "TC-05_register_validation")