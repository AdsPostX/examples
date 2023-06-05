window.AdpxConfig.targetElement = "adpx_box";
// Adding a custom template and overwriting the existing one coming from launcher.impl.js
window.AdpxConfig.template = `
<div class = 'adpx_modal' >
<div class='adpx_header-container'>
<div class='adpx_header adpx_header-text'>
AdsPostX Native Ads Api Demo-UI
</div>
<div class = 'adpx_modal-close-btn adpx_close-icon' onClick="window.Adpx?.close()">x</div>
</div>
<div id = 'adpx_modal-container'>
<div class = 'adpx_section'>
<div class = 'adpx_info-container'>
<h1 class='adpx_headline'></h1>
<img class = 'adpx_image-mobile-view'  />
<h1 class='adpx_description'></h1>
<div class = 'adpx_product-price'></div>
<div class='adpx_button-container'>
<button class='adpx_cta-yes' >
</button>
<button class='adpx_cta-no' onClick="window.Adpx?.reject()">
</button>
</div>
<div class = 'adpx_product-shipping-text'> 
</div>
</div>
<div class = 'adpx_image-container'>
<img class = 'adpx_image'/>
</div>
</div>
<div class='adpx_pagination'>
<div class ='adpx_left-arrow' onClick="window.Adpx?.rewind();"><svg height="26px" width="26px" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Left, Arrow, Back</title><path d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10,10,0,0,1,12,22Z"></path><polygon points="14.11 5.67 7.77 12 14.11 18.33 15.52 16.92 10.6 12 15.52 7.08 14.11 5.67"></polygon></svg></div>

<div class ='adpx_right-arrow' onClick="window.Adpx?.show()">
<svg height="26px" width="26px" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Right, Next, Arrow</title><path d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10,10,0,0,1,12,22Z"></path><polygon points="8.48 7.08 13.4 12 8.48 16.92 9.89 18.33 16.23 12 9.89 5.67 8.48 7.08"></polygon></svg></div>
</div>
<div class='adpx_external-link'>
</div>
<div class='adpx_powered'>
<div class="adpx_terms">

</div>
<span class ='adpx_privacy-policy-link adpx_footer-text' onClick="apxPrivacyPolicy(settings.privacy_policy)" ></span> 

<span class ='adpx_publisher-link' onClick="apxPrivacyPolicy(settings.privacy_policy)"  ><span class ='adpx_link-separator'>|</span> </span>
</div>
</div>
</div>
`;
console.log("window.AdpxConfig", window.AdpxConfig);

// Overwriting the render function as we have modified the window.AdpxConfig.template.
// We now have a new selector .adpx_header-container
// Added few new styles like button text color in this modified render function.
// for more detailed explanation check https://launcher-custom.onrender.com/launcher.impl.js .

window.AdpxConfig.render = (data, index, settings, styles) => {
  console.log("[launcher.impl.js] render at index:", index, data);
  console.log("[launcher.imp.js] settings & styles:", settings, styles);

  const targetId = window.AdpxConfig.targetElement ?? "adpx_box";
  const target = document.getElementById(targetId);
  if (!target) {
    return false;
  }

  // List of selectors that update with each Offer.
  const selectors = [
    {
      selector: ".adpx_modal",
      callback: (element, settings, styles) => {
        if (!window.AdpxConfig?.overwriteStyles) {
          return;
        }

        let margins = (settings?.screen_margin ?? 0) + "px";
        element.style.margin = margins;

        const position = settings?.ad_position ?? "center";
        element.setAttribute("data-position", position);

        if (!styles || !styles.popup) {
          return;
        }

        let pstyles = styles.popup;
        Object.assign(element.style, pstyles);
        element.style.backgroundColor = pstyles.backgroundColor;
        element.style.background = pstyles.background;
        element.style.borderRadius = `
  ${pstyles.borderRadius.top_left}px
  ${pstyles.borderRadius.top_right}px
  ${pstyles.borderRadius.bottom_left}px
  ${pstyles.borderRadius.bottom_right}px
`;
      },
    },

    {
      selector: ".adpx_header-container",
      callback: (element, settings, styles) => {
        if (!window.AdpxConfig?.overwriteStyles) {
          return;
        }

        if (!styles?.header) {
          return;
        }

        Object.assign(element.style, styles.header);
        element.style.backgroundColor = styles.header.backgroundColor;
        element.style.borderTopLeftRadius =
          styles.popup.borderRadius.top_left + "px";
        element.style.borderTopRightRadius =
          styles.popup.borderRadius.top_right + "px";

        if (!styles.popup) {
          return;
        }

        let pstyles = styles.popup;
        element.style.borderTopLeftRadius = `${pstyles.borderRadius.top_left}px`;
        element.style.borderTopRightRadius = `${pstyles.borderRadius.top_right}px`;
      },
    },

    {
      selector: ".adpx_header",
      callback: (element, settings, styles) => {
        if (!window.AdpxConfig?.overwriteStyles) {
          return;
        }

        if (!styles?.header) {
          return;
        }

        Object.assign(element.style, styles.header);
        element.style.color = styles.header.textColor;
        element.style.fontSize = styles.header.fontSize + "px";
        element.innerHTML = styles.header.text;
        if (!styles.popup) {
          return;
        }

        let pstyles = styles.popup;
        element.style.borderTopLeftRadius = `${pstyles.borderRadius.top_left}px`;
        element.style.borderTopRightRadius = `${pstyles.borderRadius.top_right}px`;
      },
    },

    {
      selector: ".adpx_headline",
      callback: (element, settings, styles) => {
        element.innerHTML = data.title;
        if (!window.AdpxConfig?.overwriteStyles) {
          return;
        }

        const offerStyles = styles?.offerText;
        element.style.color = offerStyles.textColor;
        if (offerStyles.font) {
          element.style.fontFamily = offerStyles.font;
        }
        element.style.fontSize = offerStyles.fontSize + "px";
      },
    },
    {
      selector: ".adpx_description",
      callback: (element, settings, styles) => {
        element.innerHTML = data.description;
        if (!window.AdpxConfig?.overwriteStyles) {
          return;
        }

        if (!styles?.offerText) {
          return;
        }

        const offerStyles = styles.offerText;
        element.style.color = offerStyles.textColor;
        element.style.fontFamily = offerStyles.font;
        element.style.fontSize = offerStyles.fontSize + "px";
      },
    },
    {
      selector: ".adpx_cta-yes",
      callback: (element, settings, styles) => {
        element.innerHTML = data.cta_yes ?? "Yes Please";
        if (!window.AdpxConfig?.overwriteStyles) {
          return;
        }

        if (!styles?.offerText?.buttonYes) {
          return;
        }

        const yesBtnStyles = styles.offerText.buttonYes;
        element.style.backgroundColor = yesBtnStyles.background;
        element.style.color = yesBtnStyles.color;

        element.style.border = `2px solid ${yesBtnStyles.stroke}`;
        element.addEventListener("mouseover", () => {
          element.style.backgroundColor = yesBtnStyles.hover;
        });
        element.addEventListener("mouseleave", () => {
          element.style.backgroundColor = yesBtnStyles.background;
        });

        element.addEventListener("click", () => {
          window.open(data.click_url, "_blank");
          window.Adpx?.show();
        });
      },
    },
    {
      selector: ".adpx_cta-no",
      callback: (element, settings, styles) => {
        element.innerHTML = data.cta_no ?? "No Thanks";
        if (!window.AdpxConfig?.overwriteStyles) {
          return;
        }

        if (!styles.offerText.buttonNo) {
          return;
        }

        const noBtnStyles = styles.offerText.buttonNo;
        Object.assign(element.style, noBtnStyles);
        element.style.color = noBtnStyles.color;
        element.style.border = `2px solid ${noBtnStyles.stroke}`;
        element.addEventListener("mouseover", () => {
          element.style.backgroundColor = noBtnStyles.hover;
        });
        element.addEventListener("mouseleave", () => {
          element.style.backgroundColor = noBtnStyles.background;
        });
      },
    },
    {
      selector: ".adpx_image-container > .adpx_image",
      callback: (element, settings, styles) => {
        if (data.image) {
          element.parentNode.style.display = "block";
          element.setAttribute("src", data.image);
        } else {
          element.parentNode.style.display = "none";
        }
      },
    },
    {
      selector: ".adpx_terms",
      callback: (element, settings, styles) => {
        if (
          settings?.showDisclaimer !== true ||
          !styles?.footer?.disclaimer?.length > 0
        ) {
          element.style.display = "none";
          return;
        }

        element.innerHTML = styles.footer.disclaimer;
      },
    },
    {
      selector: ".adpx_footer-text",
      callback: (element, settings, styles) => {
        element.innerText = styles.footer.text;

        if (!window.AdpxConfig?.overwriteStyles) {
          return;
        }

        if (!styles?.footer) {
          return;
        }

        Object.assign(element.style, styles.footer);
        element.style.color = styles.footer.textColor;
        element.style.fontSize = styles.footer.fontSize + "px";
        element.style.fontFamily = styles.footer.font;
      },
    },
    {
      selector: ".adpx_pagination",
      callback: (element, settings, styles) => {
        // Implement to render pagination
      },
    },
    {
      // privacy link in footer
      selector: ".adpx_publisher-link",
      callback: (element, settings, styles) => {
        if (!window.AdpxConfig?.overwriteStyles) {
          return;
        }

        const footerStyles = styles?.footer;
        console.log('Footer styles: ', footerStyles)
        if (!footerStyles) {
          return;
        }

        if (footerStyles.publisher_privacy_policy?.trim().length > 0) {
          element.href = footerStyles.publisher_privacy_policy;
          element.innerText = `${footerStyles.publisher_name} Privacy Policy`;
        } else {
          element.style.display = "none";
        }
      },
    },
  ];

  selectors.forEach((item) => {
    const elements = target.querySelectorAll(`${item.selector}`);
    if (elements?.length > 0) {
      elements.forEach((element) => {
        item.callback(element, settings, styles);
      });
    } else {
      console.log("[ERROR] Element not found: ", item.selector);
    }
  });

  if (window.AdpxConfig?.overwriteStyles === true && settings?.darken_bg) {
    target.setAttribute("data-background", "enabled");
  }

  target.style.display = "block";
};

document.querySelector(".load").addEventListener("click", function () {
  window.Adpx.load();
});
document.querySelector(".show").addEventListener("click", function () {
  window.Adpx.show();
});
document.addEventListener("DOMContentLoaded", () => {
  console.log("[demo] document ready", window.Adpx?.isReady(), window.Adpx);
  window.AdpxConfig.accountId = "2de283dc-982f-4adb-803f-ef459e6d966a";

  document.querySelector(".init").addEventListener("click", function () {
    window.Adpx.init();
  });
});
 targetId = window.AdpxConfig.targetElement ?? 'adpx_box';
 target = document.getElementById(targetId);
if (!target) {
  console.log('[launcher.impl] target not found - creating one');
  target = document.createElement('div');
  target.setAttribute('id', targetId);
  document.body.appendChild(target);
}

if (target) {
  target.innerHTML = window.AdpxConfig.template;
}