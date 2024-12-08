import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    // Wait for Google Translate to load
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,fr,es,zh-CN',
          autoDisplay: false,
        },
        'google_translate_element'
      );

      // Remove the toolbar after translation
      setTimeout(() => {
        const translateBar = document.querySelector('.goog-te-banner-frame');
        if (translateBar) {
          translateBar.style.display = 'none';  // Force hide the bar
        }
      }, 2000);  // Delay to ensure translation completes

      // Remove the bar permanently after translation change
      const observer = new MutationObserver(() => {
        const translateBar = document.querySelector('.goog-te-banner-frame');
        if (translateBar) {
          translateBar.style.display = 'none';
        }
      });

      // Observe changes in the DOM
      observer.observe(document.body, { childList: true, subtree: true });
    };

    return () => {
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return <div id="google_translate_element" style={{ position: 'fixed', bottom: "1%", left: 55 }}></div>;
};

export default GoogleTranslate;
