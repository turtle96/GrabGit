<p align="center"><img src="img/icon.png" width="200"><br>

# GrabGit

Done for CS3219 Assignment 5.

The objective of this assignment is to create a web application that allows developers to grab statistics from git repositories (hence the name GrabGit). These statistics serve to provide a measurement of productivity of the development team. By analysing these statistics, developers may improve their productivity by changing the workflow, management policies or team collaboration style etc. Team managers can also use this tool to keep track of the team’s overall progress and productivity.

## Web Link
Hosted on GitHub Pages: [GrabGit](https://turtle96.github.io/GrabGit/)

Note: The browser may block unsafe content because demo contains files load over mixed HTTP & HTTPS. You need to explicitly allow these script by clicking the 'shield' button on right-hand side of the addressbar (Google Chrome).

## Companion Services
Controller Server: [https://github.com/kfwong/GrabGit-Server](https://github.com/kfwong/GrabGit-Server)

GrabGit Repository (Frontend): This repository

Telegram Chatbot Repository: [https://github.com/turtle96/grabGit-chatbot](https://github.com/turtle96/grabGit-chatbot)

## Features
a) For the given GIT repo show the contribution of all team members. (The granularity
for the contribution can be one or many of the parameters like number of commits,
insertion, deletions, etc.)

b) For a given team member show the commit history. The duration for the
visualization should be allowed to be taken as input by the user ranging from start of
the project (or any reasonable start date) to current date.

c) GIT-Guard should allow user to compare the efforts of or more team members by
comparing the visualization in 1(b) over a period of time.

d) GIT-Guard should show the commit history of all the users, for a specific file in the
repo. It should also provide an option to select a code chunk (specific line numbers)
and show the history of edits on those lines.

e) Show a visualization of number of lines of code in the final project version by each
team member.

## Developers
[Dylan Chew](https://github.com/zavfel) - author for (a) and its git command script

[Jazlyn Ang](https://github.com/turtle96) - author for (b), 1(c) and its git command & python script

[Wong Kang Fei](https://github.com/kfwong) - Managing GrabGit-Server, author for (d)

[Vivian Low](https://github.com/sunset1215) - author for (e) and its git command script

## Acknowledgements
Icon is sourced from [Iconfinder](https://www.iconfinder.com/icons/249191/git_github_octocat_social_social_media_icon#size=128), and designed by [Jessica Lanan](http://jessicalanan.com/).
