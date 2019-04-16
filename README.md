# SPEECH RECOGNITION CHATBOT ADAPTER

### Table of Contents
* [Description](#description)
* [Browser support](#browser-support)
* [Installation](#installation)
* [Configuration](#configuration)
* [Integration example](#integration-example)

## Description
This adapter for the Inbenta Chatbot SDK recognizes voice input and converts it to text using the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API) and the external library [annyang](https://www.talater.com/annyang/)

## Browser support
Support for Web Speech API speech recognition is curently limited to Chrome for Desktop and Android.

## Installation
In order to add this adapter to your SDK, you need to import the file `/src/adapters/speech-to-text-adapter.js` into your HTML/JS file where you're building the SDK. Then, append it to the SDK adapters array providing the adapter configuration as shown in the [example](#integration-example) section.

## Configuration
This adapter expects a Javascript object containing all these configuration parameters:
- **voiceRecording (boolean)**: Set to `true`/`false` to activate or deactivate speech recognition.
 - **voiceRecordingLang (string)**: ISO language code, e.g.: `en-US`.
 - **autoInput (boolean)**: If enabled, recognazied speech will be directly sent as  message. If disabled, recognized text will be set in the input text box, waiting to be reviewed and sent with the chabot send button.
This would be a valid configuration object:
```javascript
    var speechToTextConfig: {
        voiceRecording: true,
        voiceRecordingLang: 'en-US',
         autoInput: true
    }
```

## Integration example
In the following example we're creating a chatbot with the speech-to-text adapter:
* Import the Inbenta Chatbot SDK (check the last available version [here](https://developers.inbenta.io/chatbot/javascript-sdk/sdk-subresource-integrity))
    ```html
    <script src="https://sdk.inbenta.io/chatbot/SDK_VERSION/inbenta-chatbot-sdk.js"></script>
    ```
* Import the speech-to-text adapter from `src/adapters/speech-to-text-adapter.js`
    ```html
     <script src="./src/adapters/speech-to-text-adapter.js"></script>
    ```
* Create a configuration object with both SDK and our custom adapter configuration
    ```javascript
    var inbApp = {
        // Inbenta Chatbot SDK credentials
        sdkAuth: {
            inbentaKey: '<your-api-key>',
            domainKey: '<your-domain-key>'
        },
        // Inbenta Chatbot SDK configuration
        sdkConfig: {
            chatbotId: 'speech_to_text_demo',
            labels: {
                en: {
                    'interface-title': 'Speech to text Demo'
                }
            },
            adapters: [],
            // Custom micro button html
            html: {
            'conversation-window-footer':
              '<conversation-window-footer-form>' +
                '<upload-media-button />' +
                '<chatbot-input />' +
                '<character-counter />' +
                '<send-button />' +
                '<div id="voice-recording" class="footer__form__voice"></div>' +
              '</conversation-window-footer-form>'
          }
        },
        // Speech to text adapter configuration
        customConfig: {
            speechToTextConfig: {
                voiceRecording: true,
                voiceRecordingLang: 'en-US',
                autoInput: true
            }
        }
    };
    ```
* Add the adapter to the SDK adapters array (passing the adapter configuration object)
    ```javascript
    inbApp.sdkConfig.adapters.push(voiceToSpeech(inbApp.customConfig.speechToTextConfig));
    ```
* Build the chatbot with our SDK configuration and credentials
    ```javascript
      window.InbentaChatbotSDK.buildWithDomainCredentials(inbApp.sdkAuth, inbApp.sdkConfig);
    ```
Here is the full integration code:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <title>Inbenta speech-to-text chatbot demo</title>
    <link rel="shortcut icon" href="#" />
    
    <!-- Import Inbenta Chatbot SDK -->
    <script src="https://sdk.inbenta.io/chatbot/1.24.0/inbenta-chatbot-sdk.js"></script>
    
    <!-- Import the speech-to-text chatbot adapter -->
    <script src="./src/adapters/speech-to-text-adapter.js"></script>
  </head>
  <body>
    <!-- INBENTA CHATBOT SDK -->
    <script type="text/javascript">
      var inbApp = {
        // Inbenta Chatbot SDK credentials
        sdkAuth: {
          inbentaKey: '<your-api-key>',
          domainKey: '<your-domain-key>'
        },
        // Inbenta Chatbot SDK configuration
        sdkConfig: {
          chatbotId: 'speech_to_text_demo',
          labels: {
            en: {
              'interface-title': 'Speech to text Demo'
            }
          },
          adapters: [],
          // Custom micro button html
          html: {
            'conversation-window-footer':
              '<conversation-window-footer-form>' +
                '<upload-media-button />' +
                '<chatbot-input />' +
                '<character-counter />' +
                '<send-button />' +
                '<div id="voice-recording" class="footer__form__voice"></div>' +
              '</conversation-window-footer-form>'
          }
        },
        // Speech to text adapter configuration
        customConfig: {
            speechToTextConfig: {
                voiceRecording: true,
                voiceRecordingLang: 'en-US',
                autoInput: true
            }
        }
      };
      // Add the speech-to-text adapter to the chatbot SDK
      inbApp.sdkConfig.adapters.push(voiceToSpeech(inbApp.customConfig.speechToTextConfig));
      // Build Inbenta Chatbot SDK
      window.InbentaChatbotSDK.buildWithDomainCredentials(inbApp.sdkAuth, inbApp.sdkConfig);
    </script>
  </body>
</html>
```
