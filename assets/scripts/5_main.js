// Mostly utility functions that are needed on every page


// USER CONSENT
// check if user agreed to cookies
function userHasConsented() {
    return typeof Cookies.get("cookieConsent") !== "undefined";
}

function setUserConsent() {
    // Sets the user consent, expiring in a year
    Cookies.set("cookieConsent", 1, { expires: 365 })
}


// Check for consent at load-time
const cookieConsentBtn = $("#consentBtn")
    , cookieConsentBlock = $(".cookieConsent");

if (!userHasConsented()) {
    cookieConsentBlock.addClass("visible")
}

// When user consents, save that into a cookie with expiry of one year
cookieConsentBtn.click(function () {
    cookieConsentBlock.removeClass("visible");
    setUserConsent();
});

// ACCESS TOKENS
function setUserToken(token) {
    // Verify that user has agreed to cookies
    if (!userHasConsented()) {
        throw "User has not consented to cookies!"
    }

    Cookies.set("accessToken", token, { expires: 14 })
}

function getUserToken() {
    // Verify that user has agreed to cookies
    if (!userHasConsented()) {
        throw "User has not consented to cookies!"
    }

    return Cookies.get("accessToken")
}
