// Mostly utility functions that are needed on every page


// USER CONSENT
// check if user agreed to cookies
function userHasConsented() {
    var consent = Cookies.get("cookieConsent");

    return typeof consent !== "undefined";
}

function setUserConsent() {
    // Sets the user consent, expiring in a year
    Cookies.set("cookieConsent", true, { expires: 365 })
}


// Check for consent at load-time
const cookieConsentBtn = $("#consentBtn")
    , cookieConsentBlock = $(".cookieConsent");

// When user consents, save that into a cookie with expiry of one year
cookieConsentBtn.click(function () {
    cookieConsentBlock.addClass("consented");
    setUserConsent();
});

// ACCESS TOKENS
function setUserToken(token) {
    // Verify that user has agreed to cookies
    if (!userHasConsented()) {
        throw "User has not consented to cookies!"
    }

    Cookies.set("accessToken", token, { expires: 7 })
}

function getUserToken(token) {
    // Verify that user has agreed to cookies
    if (!userHasConsented()) {
        throw "User has not consented to cookies!"
    }

    return Cookies.get("accessToken")
}
