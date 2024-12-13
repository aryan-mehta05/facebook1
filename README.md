# Facebook 2.0

This app is the clone of the actual Facebook website that encompasses a lot of the features provided by Facebook! Some of the additional features implemented in this application are Google Auth, Dark/Light Mode, Role-based access control, etc.

## Course Details
- **TITLE** ~ CS:5610 - Web Development
- **FACULTY** ~ Dr. Jose Annunziato
- **SEMESTER** ~ Fall 2024
- **TEAM** ~ Aryan Mehta, Phuong Linh Nguyen

## Collaborators' Note

To collaborate on this project, follow the steps below:

1. Clone this repository into your project folder by running
\
`git clone https://github.com/aryan-mehta05/facebook.git`

2. Next, run the following command to make sure you have all the required packages installed.
\
`npm install`

3. Make sure the project runs using the following command
\
`npm start`

---
#### Standard practices for collaborators

- **STEP 1** \
***Before** making any changes at all to code files*, run \
`npm install` \
This makes sure that you have all the required packages installed that may have been installed by other collaborators to make changes.

- **STEP 2** \
Create a new branch called 'your-name' and only then start making any changes \
`git checkout -b <your-name>` \
*For example, if your name is Sam, then
`git checkout -b sam`*

- **STEP 3** \
Now work on your part of the project and make the updates/changes, making sure that it is **NOT** on the main branch. Make sure that it is in *YOUR BRANCH*.

- **STEP 4** \
Another collaborator may have pushed some changes while you were working on your part. If you do not have those files in your local folder, then there will be errors and conflict if you try to push your own changes. Hence, make sure that you pull the changes that have been made to the main branch.

  - To do this, first check if your local repository is *behind* the main branch \
  `git status`

  - If it is behind, then run \
  `git pull`
\
*This makes sure that all the changes in the main branch are reflected in your local repository.*

- **STEP 5** \
Now that the pull is made and your work is done, add, commit, and push it to the remote on your branch itself. \
`git add .` \
`git commit -m "Description of what you have worked on"` \
`git push -u origin sam` (if your branch name is 'Sam')

- **STEP 6** \
Wait for code review and see if any further changes or fixes are required to be made.

- **STEP 7** \
If you have made the fixes, or if no changes are required, then you can now finally delete your branch before further work. \
`git checkout main` \
`git branch -d sam`

- **STEP 8** \
Finishing step 7 means that all your pushes have been successfully merged into the main branch, and now you can start to work a new part of the project. Hence, run these commands again. \
`git pull` \
`git checkout -b sam` \

Once you've done this, it means you're at **Step 3** where you can again work on your new task. Steps 3-8 repeat until the project is completed.

---

For the purposes of authenticity and integrity, this codebase remains the property of the members working on this project, hence any unauthorized copies of this codebase will be subject to the academic integrity laws enforced by Northeastern University.

---
© Aryan Mehta 2024.