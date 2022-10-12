"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}

//favoriting and unfavoriting!:
function favorited(evt) {
  const target = $(evt.target);
  const starCheck = target.attr("class");
  const isChecked = target.is(":checked");
  //this checks to see if a user is clicking a star and checking it
  if (starCheck == "star" && isChecked) {
    const story = target.parent();
    const idCheck = story.attr("id");
    const currentFavorites = $favoritedList.children();
    const childArr = $.makeArray(currentFavorites);
    const idArr = [];

    //this fills idArr with all the current favorited story IDs
    for (const favorite of childArr) {
      const currFavorite = $(favorite);
      const otherID = currFavorite.attr("id");
      if (idArr.indexOf(otherID) == -1) {
        idArr.push(otherID);
      }
    }
    //this is then tested with our current targets story ID. If it does not match with any prexisting ones, it will add it to the favorites!
    if (idArr.indexOf(idCheck) == -1) {
      console.log("favorited!");
      story.clone().appendTo($favoritedList);
      User.addFavorite(currentUser, idCheck);
    } else {
      target.prop("checked", false);
      alert("This story is already favorited!");
    }
  }
}

//this will delete items from the favorited list.
function unfavorited(evt) {
  const target = $(evt.target);
  const starCheck = target.attr("class");
  if (starCheck == "star") {
    const story = target.parent();
    const idCheck = story.attr("id");
    User.deleteFavorite(currentUser, idCheck);
    story.remove();
  }
}

$allStoriesList.on("click", favorited);
$favoritedList.on("click", unfavorited);

//this will delete user-created stories from every list.
async function deleteStory(evt) {
  console.debug("deleteStory");
  const target = $(evt.target);
  const trashCheck = target.attr("class");
  if (trashCheck == "fas fa-trash-alt") {
    const story = target.parent();
    const idCheck = story.attr("id");
    await storyList.removeStory(currentUser, idCheck);
    story.remove();
  }
}

$userStoriesList.on("click", deleteStory);
