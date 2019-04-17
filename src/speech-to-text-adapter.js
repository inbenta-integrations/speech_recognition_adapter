/**
 *
 * Returns chatbot answer with default answer to show sidewindow content
 *
 * @return {function}
 *   Inbenta Chatbot SDK adapter function
 *
 */

var speechToText = function (speechtoTextConf) {
  return function (chatbot) {
    // Don't do anythingn if voiceRecording set to false or is not Chrome
    if (!speechtoTextConf.voiceRecording) return;

    // Import annyang after checking if it already exists
    if (typeof window.annyang === 'undefined') {
      var dom = document.createElement('script');
      dom.src = 'https://cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js';
      document.getElementsByTagName('head')[0].appendChild(dom, document.currentScript);
    }

    // Bind click function to activate micro or remove it if not chrome
    var activateMicro = function () {
      var listenerID = arguments[0];
      var [el] = arguments[1];
      var chatbot = arguments[2];
      if (!isChrome() && el) {
        el.parentNode.removeChild(el);
        chatbot.helpers.removeListener(listenerID);
      } else if (el) {
        // Initiate voice recording
        // Check that voiceRecording does not exit previously to avoid duplication
        if (!window.voiceRecording) window.voiceRecording = new VoiceRecording(chatbot, voiceRecordingConf);
        // Remove any previos click event to avoid duplicates
        el.addEventListener('click', function () { window.voiceRecording.play() });
        chatbot.helpers.removeListener(listenerID)
      }
    }

    // Listenter to on elementExist voice recording button on page refresh
    chatbot.subscriptions.onReady(function (next) {
      if (chatbot.actions.getSessionData().visible) chatbot.helpers.setListener('#voice-recording', 'elementExists', activateMicro, chatbot);
      return next();
    });

    // Listenter to on elementExist voice recording button on minimize/maximize
    chatbot.subscriptions.onShowConversationWindow(function (next) {
      chatbot.helpers.setListener('#voice-recording', 'elementExists', activateMicro, chatbot);
      return next();
    });

    /**
     * Voice recording conf
     */
    var voiceRecordingConf = {
      lang: speechtoTextConf.voiceRecordingLang,
      autoInput: speechtoTextConf.autoInput,
      buttonSelector: '#voice-recording',
      inputSelector: '#inbenta-bot-input',
      active: ['footer__form__voice--active']
    }

    /**
     *
     * Voice recording with Annyang
     * Version 2.6.0
     * Documentation: https://github.com/TalAter/annyang
     *
     *
     * @return {object}
     *   VoiceRecording object based on annyang external library
     *
     */
    class VoiceRecording {
      constructor (chatbot, conf) {
        this.button = conf.buttonSelector;
        this.class = conf.active;
        this.input = conf.inputSelector;
        this.lang = conf.lang;

        if (window.annyang) {
          window.annyang.init({}, true);
          window.annyang.setLanguage(this.lang);
          window.annyang.addCallback('start', function (data) {
            toggleButtonClass(true);
          });
          window.annyang.addCallback('result', function (data) {
            toggleButtonClass(false);
            printData(data[0]);
          });
          window.annyang.addCallback('end', function (data) {
            toggleButtonClass(false);
          });
        }

        var toggleButtonClass = (bool) => {
          var el = document.querySelector(this.button);
          if (el && bool) {
            for (let i = this.class.length - 1; i >= 0; i--) { el.classList.add(this.class[i]) }
          } else if (el) {
            for (let i = this.class.length - 1; i >= 0; i--) { el.classList.remove(this.class[i]) }
          }
        }

        var printData = (data) => {
          if (conf.autoInput) {
            chatbot.actions.sendMessage({ message: data });
            chatbot.actions.displayUserMessage({ message: data });
          } else {
            var selector = this.input;
            if (selector) {
              chatbot.actions.suggestAnswer({ message: data });
            }
          }
        }
        this.play = function () {
          window.annyang.start({
            autoRestart: false,
            continuous: false
          });
        }
      }
    }

    /**
     *
     * Check if the browser is chrome
     *
     */
    function isChrome () {
      // please note,
      // that IE11 now returns undefined again for window.chrome
      // and new Opera 30 outputs true for window.chrome
      // but needs to check if window.opr is not undefined
      // and new IE Edge outputs to true now for window.chrome
      // and if not iOS Chrome check
      // so use the below updated condition
      var isChromium = window.chrome;
      var winNav = window.navigator;
      var vendorName = winNav.vendor;
      var isOpera = typeof window.opr !== 'undefined';
      var isIEedge = winNav.userAgent.indexOf('Edge') > -1;
      var isIOSChrome = winNav.userAgent.match('CriOS');

      if (isIOSChrome) {
        // is Google Chrome on IOS
        return true;
      } else if (
        isChromium !== null &&
        typeof isChromium !== 'undefined' &&
        vendorName === 'Google Inc.' &&
        isOpera === false &&
        isIEedge === false
      ) {
        // is Google Chrome
        return true;
      } else {
        // not Google Chrome
        return false;
      }
    }
  }
}
