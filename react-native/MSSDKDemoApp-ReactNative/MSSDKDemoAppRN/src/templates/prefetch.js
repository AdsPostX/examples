/**
 * HTML template for WebSDK integration
 */
export const prefetchTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>
      // Main Adpx integration logic
      try {
        console.log('HTML script block TRY entered');

        // Initialize AdpxConfig with required parameters and callback
        console.log('Initializing AdpxConfig...');
        window.AdpxConfig = {
          accountId: '%%SDK_ID%%',
          autoLoad: true,
          prefetch: true,
          autoShow: false,
          callback: (event, payload) => {
            console.log('Adpx callback:', event, payload);
            // Send message to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'adpxCallback',
              event,
              payload
            }));
          },
        };
        console.log(
          'AdpxConfig initialized: ' + JSON.stringify(window.AdpxConfig),
        );

        // Initialize AdpxUser (can be extended for user-specific data)
        window.AdpxUser = {};
        console.log('AdpxUser initialized');

        // Dynamically load the Adpx script
        console.log('Loading Adpx script directly...');
        const script = document.createElement('script');
        script.src = '%%CDN_URL%%';
        script.importance = 'high';
        script.crossOrigin = 'anonymous';
        script.async = true;
        script.onload = function () {
          console.log('Adpx script loaded successfully');

          if (window.Adpx) {
            // Initialize Adpx with config and callback
            console.log('Adpx object found, initializing...');
            window.Adpx.init(window.AdpxConfig, window.AdpxConfig.callback);

            console.log('Adpx initialized successfully');
          } else {
            console.error('Adpx not found after script load');
          }
        };
        script.onerror = function (error) {
          console.error(
            'Error loading Adpx script: ' +
              (error ? error.message : 'Unknown error'),
          );
        };
        document.head.appendChild(script);
        console.log('Script element appended to head');
      } catch (outerError) {
        console.error(
          'FATAL ERROR in HTML script block: ' +
            outerError.message +
            ' Stack: ' +
            outerError.stack,
        );
      }
    </script>
  </head>
  <body></body>
</html>`;
