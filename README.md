# DadNames
A google app script for guessing dad names and keep track of them

# How to use
## Google sheet
Create a new spreadsheet in google docs

in the "Tools" menu, click on "script editor". This will open a new tab with a code pane.

Copy the contents of the "script.gs" file from this repository, and replace the contents of the code editor with that, then save (ctrl + S) and give the project a name.

In the top menu, click "Publish" > "Deploy as a web app". Under "Who has access to the app:" select "Anyone, even anonymous". You can then click the "Deploy" button. This will prompt you to authorize the app using your google account. It requires the permission to view, edit and create spreadsheets (since it modifies a spreadsheet). You will need to go into "advanced" to authorize the app, since it hasn't been officially authorized by google.

The page will now open a modal dialog with "current web app url", copy the contents of that as we will need that to set up the streamElements commands.

## Stream Elements
go to your bot commands in stream elements, and create a new custom command. This spreadsheet currently supports 2 commands: one to add a guess, and one to show guesses that have already been made. You can name them however you want, so long as the "response" field is filled out correctly. Your google app url should end with "/exec".

### add guess command
choose a name for the command, then inside of the "response" field, write the following:
```
${<google app url>?command=guessName&args=%5B%22${queryescape ${1:}}%22%5D}
```
make sure to set the proper permissions for this command (broadcaster/moderators). Currently, this command is case sensitive, so make sure to always guess names with proper capitalization to avoid duplicates.

### show previous guesses command
choose a name for the command, then inside of the "response" field, write the following:
```
${customapi.<google app url>?command=showNames&args=%5B${queryescape ${1:}}%5D}
```

At the moment, this command will fail silently if it's not typed in correctly. This command always requires a page number, although I'm not quite sure why, since the google script should return the first page by default. It seems stream elements does not call the script when there is no additional argument. The command syntax is the following:

```
!<commandName> <pageNum>
```
