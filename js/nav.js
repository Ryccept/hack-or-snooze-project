"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//to show the form to add a story!:
function navStorySubmitClick(evt) {
  console.debug("navStorySubmitClick", evt);
  hidePageComponents();
  $newStoryForm.show();
}
$navStorySubmit.on("click", navStorySubmitClick);

//shows a users favorites:
function navFavorited(evt) {
  console.debug("navStorySubmitClick", evt);
  hidePageComponents();
  $favoritedList.show();
}

$navFavorites.on("click", navFavorited);

//to go to your stories!:
function navYourStories(evt) {
  console.debug("navYourStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $userStoriesList.show();
}

$navUserStories.on("click", navYourStories);
