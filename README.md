# Cards to Get Woke.
Deployed here: [Get Woke](https://shielded-inlet-36595.herokuapp.com/)

Revisit America's unsung heros through a deck of cards.

This is stuff you won't find in history books, the forgotten struggles and unifiying strength brought to America by minorities, immigrants, and their supporters. 

Get woke.

This app uses an alorithm to emulate [spaced repetition](https://www.theguardian.com/education/2016/jan/23/spaced-repetition-a-hack-to-make-your-brain-store-information). 


![Following card of Get Woke](https://i.imgur.com/exTBnsW.png "Preview of GetWoke")

This deck of cards cycles through images of a individuals who shaped American discourse on civil rights within the States and abroad. 

The purpose is to highlight how outsiders continuously shaped American ideals and how these ideas influence the world. 


# Features
-Users can create an account
-Users can store where they last ended their study session
-Users can have a customized order of cards based on how well they answer questions

## To Come
-Users can keep score of their progress
-Users can post new cards to the deck
-Card descriptions will be added to give more information on each historical figure


# How to Use
Create an account or login. Enter an answer. Click next for the next card.

![Landing page of Get Woke](https://i.imgur.com/DzTA16P.png "Users will be greated here")

![Register page of Get Woke](https://i.imgur.com/8sloM0I.png "Users will be able to register a new account here")

![First card of Get Woke](https://i.imgur.com/Rmag0cV.png "Users are presented with this as the first card. They can answer and receive feedback. When they click next, the next card will appear")

![Following card of Get Woke](https://i.imgur.com/exTBnsW.png "The next card in the deck")

## Server
- Authentication(login):   auth/router.js
- All the events handling: questions/router.js
- All the user handling:   user/router.js
- User model:              users/models.js
- Question model:          questions/models.js
- config file:             config.js
- server file:             server.js

## Code Style
Standard/Thinkful-style
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Tech/framework used

<b>Built with</b>
- [Express](https://expressjs.com/)
-[Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org/)
- [Mocha](https://mochajs.org/)
- [Chai](http://www.chaijs.com/)
- [Enzyme](https://airbnb.io/enzyme/docs/api/)
- [Travis](https://travis-ci.org)

## Credits
Thank you to the Thinkful team for their wonderful support. 