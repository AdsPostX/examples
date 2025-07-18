/**
 * HTML template for WebSDK checkout integration
 * This template includes styling and structure for displaying offers in the checkout flow
 */
export const checkoutTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body,
      html {
        margin: 0;
        padding: 0;
        width: 100%;
        min-height: 100%;
        font-family: system-ui, sans-serif;
      }
      .header {
        background: #007aff;
        color: white;
        padding: 24px 16px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
      }
      .header p {
        margin: 8px 0 0 0;
        font-size: 15px;
        opacity: 0.9;
      }
      #target {
        padding: 20px;
        min-height: calc(100vh - 140px);
      }
      .footer {
        background: #007aff;
        padding: 12px;
        text-align: center;
        font-size: 12px;
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>MomentScience Demo App</h1>
      <p id="offers-count">%%OFFERS_COUNT%% offers available</p>
    </div>
    <div id="adpx"></div>

    <script>
      // Configuration
      window.AdpxConfig = {
          accountId: '%%SDK_ID%%',
          autoShow: true,
          %%AUTOLOAD_CONFIG%%,
          callback: (event, payload) => {
              console.log("Adpx callback:", event, payload);
            // Send message to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'adpxCallback',
              event,
              payload
            }));
          }
      };

      window.AdpxUser = {};

      // Load Adpx script
      const script = document.createElement('script');
      script.src = '%%CDN_URL%%';
      script.async = true;
      script.onload = function() {
          async function setResponse() {
              %%RESPONSE_HANDLING%%
          }

          window.Adpx.init(window.AdpxConfig, window.AdpxConfig.callback).then(async () => {
              await setResponse();
          });
      };
      document.head.appendChild(script);
    </script>

    <div class="footer">© 2025 MomentScience</div>
  </body>
</html>`;
