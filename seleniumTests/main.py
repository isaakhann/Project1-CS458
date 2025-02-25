from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# URL of the deployed React app
URL = "https://project1-cs458.vercel.app/"

# User credentials for email authentication
TEST_EMAIL = "testuser@example.com"
TEST_PASSWORD = "TestPassword123!"

# Initialize WebDriver
driver = webdriver.Chrome()
driver.get(URL)
wait = WebDriverWait(driver, 10)  # Wait up to 10 seconds for elements to appear

try:
    # 🟢 TEST SIGN UP
    print("Testing sign-up...")

    wait.until(EC.presence_of_element_located((By.TAG_NAME, "h2")))
    sign_up_toggle = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign Up')]")
    sign_up_toggle.click()

    email_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
    password_input = driver.find_element(By.XPATH, "//input[@type='password']")
    sign_up_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign Up')]")

    email_input.send_keys(TEST_EMAIL)
    password_input.send_keys(TEST_PASSWORD)
    sign_up_button.click()

    time.sleep(3)  # Wait for authentication
    print("Sign-up successful!")

    # 🟢 TEST LOGOUT
    print("Testing logout...")
    logout_button = wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Logout')]")))
    logout_button.click()
    time.sleep(2)
    print("Logout successful!")

    # 🟢 TEST LOGIN WITH EMAIL
    print("Testing login with email...")
    
    email_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
    password_input = driver.find_element(By.XPATH, "//input[@type='password']")
    sign_in_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")

    email_input.send_keys(TEST_EMAIL)
    password_input.send_keys(TEST_PASSWORD)
    sign_in_button.click()

    time.sleep(3)  # Wait for authentication
    print("Email login successful!")



finally:
    print("Closing browser...")
    time.sleep(5)
    driver.quit()
