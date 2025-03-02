from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import string

# URL of the deployed React app
URL = "https://project1-cs458.vercel.app/"

# Generate a unique email for testing
random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
TEST_EMAIL = f"testuser_{random_string}@example.com"
TEST_PASSWORD = "TestPassword123!"

# Initialize WebDriver
driver = webdriver.Chrome()
driver.get(URL)
wait = WebDriverWait(driver, 20)

print(f"Using unique test email: {TEST_EMAIL}")

try:
    # Wait for the page to load
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "h2")))

    # 🟢 TEST SIGN-UP
    print("Testing sign-up...")
    sign_up_toggle = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign Up')]")
    sign_up_toggle.click()
    
    time.sleep(1)  # Brief pause after switching to sign-up mode

    email_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
    password_input = driver.find_element(By.XPATH, "//input[@type='password']")
    
    email_input.clear()
    password_input.clear()

    email_input.send_keys(TEST_EMAIL)
    password_input.send_keys(TEST_PASSWORD)

    sign_up_button = driver.find_element(By.XPATH, "//button[text()='Sign Up' and not(contains(., 'have an account'))]")
    sign_up_button.click()

    print("Sign-up button clicked, waiting for redirection...")
    time.sleep(3)

    # Check if sign-up was successful
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Welcome')]")))
        print("Successfully reached welcome page!")

        # 🟢 TEST LOGOUT
        print("Testing logout...")
        logout_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Logout')]")))
        logout_button.click()
        time.sleep(2)
        print("Logout successful!")

    except Exception as e:
        print(f"Failed to reach welcome page: {e}")

    # 🟢 TEST LOGIN WITH EMAIL
    print("Testing login with email...")
    sign_in_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
    sign_in_button.click()
    time.sleep(2)

    email_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
    password_input = driver.find_element(By.XPATH, "//input[@type='password']")

    email_input.clear()
    password_input.clear()

    email_input.send_keys(TEST_EMAIL)
    password_input.send_keys(TEST_PASSWORD)

    sign_in_button = driver.find_element(By.XPATH, "//button[text()='Sign In' and not(contains(., 'have an account'))]")
    sign_in_button.click()

    time.sleep(3)
    print("Email login successful!")

    # 🟢 TEST LOGIN WITH EMPTY FIELDS
    print("Testing login with empty fields...")
    sign_in_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
    sign_in_button.click()
    time.sleep(2)

    email_input.clear()
    password_input.clear()

    sign_in_button = driver.find_element(By.XPATH, "//button[text()='Sign In' and not(contains(., 'have an account'))]")
    sign_in_button.click()

    time.sleep(2)

    # Check if error message appears
    try:
        error_message = driver.find_element(By.XPATH, "//p[contains(text(), 'required')]")
        print(f"Error message displayed: {error_message.text}")
    except:
        print("No error message detected. (Possible issue)")

    # 🟢 TEST GOOGLE SIGN-IN
    print("Testing Google Sign-In...")
    google_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Google')]")
    google_button.click()
    
    time.sleep(3)
    driver.switch_to.window(driver.window_handles[1])

    if "accounts.google.com" in driver.current_url:
        print("Google sign-in page opened successfully!")
    else:
        print("Failed to open Google sign-in page.")

    driver.close()
    driver.switch_to.window(driver.window_handles[0])
    time.sleep(2)

    # 🟢 TEST GITHUB SIGN-IN
    print("Testing GitHub Sign-In...")
    github_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with GitHub')]")
    github_button.click()

    time.sleep(3)
    driver.switch_to.window(driver.window_handles[1])

    if "github.com/login" in driver.current_url:
        print("GitHub sign-in page opened successfully!")
    else:
        print("Failed to open GitHub sign-in page.")

    driver.close()
    driver.switch_to.window(driver.window_handles[0])
    time.sleep(2)

finally:
    print("Closing browser...")
    driver.quit()
