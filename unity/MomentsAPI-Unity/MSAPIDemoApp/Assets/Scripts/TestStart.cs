using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;
using UnityEngine.UI;

public class TestStart : MonoBehaviour
{
    [Header("UI References")]
    [SerializeField] private TMP_InputField apiKeyInputField;
    [SerializeField] private Button submitButton;
    [SerializeField] private GameObject panelAPIKey;
    [SerializeField] private Toggle toggleDevMode;

    [Header("Error Panel")]
    [SerializeField] private GameObject errorPanel;
    [SerializeField] private TextMeshProUGUI errorText;
    [SerializeField] private Button okButton;

    [Header("Scene Settings")]
    [SerializeField] private string nextSceneName = "TestOffersScene";

    public static bool InvalidAPIKeyDetected = false;

    private void Start()
    {
        // Check if invalid API key was detected
        if (InvalidAPIKeyDetected)
        {
            // Disable the API key panel
            if (panelAPIKey != null)
            {
                panelAPIKey.SetActive(false);
            }
            
            // Show error message
            ShowError("Invalid API Key. Please contact support.");
            
            // Reset the flag
            InvalidAPIKeyDetected = false;
            return;
        }

        // Hide error panel initially
        if (errorPanel != null)
            errorPanel.SetActive(false);

        // Add listener to the submit button
        if (submitButton != null)
        {
            submitButton.onClick.AddListener(OnSubmitClicked);
        }

        // Add listener to the OK button
        if (okButton != null)
        {
            okButton.onClick.AddListener(OnOkClicked);
        }

        // Add listener to the dev mode toggle to save state immediately
        if (toggleDevMode != null)
        {
            toggleDevMode.onValueChanged.AddListener(OnDevModeToggleChanged);
        }
    }

    private void OnDevModeToggleChanged(bool isOn)
    {
        // Save dev mode state immediately when toggle changes
        PlayerPrefs.SetInt("DevMode", isOn ? 1 : 0);
        PlayerPrefs.Save();
        Debug.Log($"Dev Mode changed to: {isOn}");
    }

    private void OnSubmitClicked()
    {
        // Validate input field is assigned
        if (apiKeyInputField == null)
        {
            Debug.LogError("API Key Input Field is not assigned!");
            ShowError("Configuration error. Please contact support.");
            return;
        }

        // Get the API key from the input field
        string apiKey = apiKeyInputField.text.Trim();

        // Validate the API key (check if it's not empty)
        if (string.IsNullOrEmpty(apiKey))
        {
            ShowError("Please enter valid API Key");
            Debug.LogWarning("API Key is empty. Please enter a valid API key.");
            
            // Disable the API key panel
            if (panelAPIKey != null)
            {
                panelAPIKey.SetActive(false);
            }
            return;
        }

        // Store the API key
        PlayerPrefs.SetString("APIKey", apiKey);
        
        // Store dev mode state
        bool isDevMode = toggleDevMode != null && toggleDevMode.isOn;
        PlayerPrefs.SetInt("DevMode", isDevMode ? 1 : 0);
        PlayerPrefs.Save();

        Debug.Log($"API Key entered: {apiKey}");
        Debug.Log($"Dev Mode: {isDevMode}");

        // Load the next scene
        LoadNextScene();
    }

    private void ShowError(string message)
    {
        if (errorPanel != null)
        {
            if (errorText != null)
                errorText.text = message;
            
            errorPanel.SetActive(true);
        }
        else
        {
            Debug.LogError($"Error: {message}");
        }
    }

    private void OnOkClicked()
    {
        // Hide the error panel
        if (errorPanel != null)
        {
            errorPanel.SetActive(false);
            if (panelAPIKey != null)
            {
                panelAPIKey.SetActive(true);
            }
        }
    }

    private void LoadNextScene()
    {
        if (string.IsNullOrEmpty(nextSceneName))
        {
            Debug.LogError("Next scene name is not configured!");
            ShowError("Configuration error. Please contact support.");
            return;
        }

        try
        {
            // Load the TestOffersScene
            SceneManager.LoadScene(nextSceneName);
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to load scene '{nextSceneName}': {e.Message}");
            ShowError("Failed to load next scene. Please try again.");
        }
    }

    private void OnDestroy()
    {
        // Remove listener to prevent memory leaks
        if (submitButton != null)
        {
            submitButton.onClick.RemoveListener(OnSubmitClicked);
        }

        // Remove OK button listener
        if (okButton != null)
        {
            okButton.onClick.RemoveListener(OnOkClicked);
        }

        // Remove toggle listener
        if (toggleDevMode != null)
        {
            toggleDevMode.onValueChanged.RemoveListener(OnDevModeToggleChanged);
        }
    }
}
