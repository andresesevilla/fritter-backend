// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-feed': viewFreetsFeed,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'delete-freet': deleteFreet,
  'create-follow': createFollow,
  'delete-follow': deleteFollow,
  'view-follows-by-follower' : viewFollowsByFollower,
  'view-follows-by-followee' : viewFollowsByFollowee,
  'view-follow-by-usernames' : viewFollowByUsernames,
  'create-private-circle': createPrivateCircle,
  'delete-private-circle': deletePrivateCircle,
  'view-private-circle': viewPrivateCircle,
  'view-private-circles': viewPrivateCircles,
  'toggle-user-in-private-circle': updatePrivateCircle,
  'view-anxiety-shield-status': viewAnxietyShieldStatus,
  'toggle-anxiety-shield-status': toggleAnxietyShieldStatus,
  'view-briefing-mode-status': viewBriefingModeStatus,
  'toggle-briefing-mode-status': toggleBriefingModeStatus,
  'report-freet-to-anxiety-shield' : reportFreet,
  'toggle-personal-anxiety-reason': togglePersonalAnxietyReason,
  'view-briefing' : viewBriefing,
  'set-briefing-size' : setBriefingSize,
  'set-briefing-refresh-period' : setBriefingRefreshPeriod
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
