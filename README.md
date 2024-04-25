script.js includes all required code;
index.html file  calls the script file;
I used parcel to run the code; made the following change in package.json file:
   "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "parcel src/index.html",
    "build": "parcel build src/index.html"
  },
