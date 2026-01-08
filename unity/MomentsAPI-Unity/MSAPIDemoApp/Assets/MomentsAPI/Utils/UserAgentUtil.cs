using UnityEngine;

namespace MomentsAPI.Utils
{
    /// <summary>
    /// Utility class for handling user agent related operations.
    /// </summary>
    public static class UserAgentUtil
    {
        /// <summary>
        /// Returns the appropriate user agent string based on the platform.
        /// </summary>
        /// <returns>A string containing the user agent appropriate for the current platform.</returns>
        /// please note below user agent are just an example and should be replaced with actual user agent
        public static string GetUserAgent()
        {
            switch (Application.platform)
            {
                case RuntimePlatform.IPhonePlayer:
                    return "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";
                
                case RuntimePlatform.Android:
                    return "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
                
                case RuntimePlatform.WebGLPlayer:
                    return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
                
                case RuntimePlatform.WindowsPlayer:
                case RuntimePlatform.WindowsEditor:
                    return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
                
                case RuntimePlatform.OSXPlayer:
                case RuntimePlatform.OSXEditor:
                    return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
                
                default:
                    return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
            }
        }
    }
}
