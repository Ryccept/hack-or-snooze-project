"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  putFavoritedStoriesOnPage(currentUser);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <input class='star' type='checkbox'>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//this is a unique story makeup for favorited stories. The difference is the star is already checked.
function generateFavoritedStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <input class='star' type='checkbox' checked>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//this is a unique story makeup for user created stories. The difference is the delete icon.
function generateOwnStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <input class='fas fa-trash-alt' type='checkbox'>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//puts favorited items on the page!:
function putFavoritedStoriesOnPage(user) {
  console.debug("putFavoritedStoriesOnPage");

  $favoritedList.empty();

  const favStories = user.favorites.map((x) => {
    return x;
  });
  // loop through all of users stories and generate HTML for them
  for (let story of favStories) {
    const $story = generateFavoritedStoryMarkup(story);
    $favoritedList.append($story);
  }
}

//when a user submits a new story:
async function newStorySubmission(event) {
  console.debug("newStorySubmission", event);
  event.preventDefault();

  const title = $("#newStoryTitle").val();
  const author = $("#newStoryAuthor").val();
  const url = $("#newStoryURL").val();

  const storyData = { title, url, author };
  const newStory = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);

  // hide the form and reset it
  $newStoryForm.slideUp("slow");
  $newStoryForm.trigger("reset");
}

$newStoryForm.on("submit", newStorySubmission);

//adds user-created stories. To be added to nav bar.:
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $userStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $userStoriesList.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateOwnStoryMarkup(story, true);
      $userStoriesList.append($story);
    }
  }
}
