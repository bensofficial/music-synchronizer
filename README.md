## Get Started 💨

Clone the repo using git:

```console
$ cd ~/Folder/you/want/to/clone/this/repository/into
$ git clone https://github.com/check24-scholarships/music-synchronizer.git
```

> Tip: Use <kbd>Tab</kbd> to complete terminal commands and show suggestions

Open the project in [Visual Studio Code](https://code.visualstudio.com/), (recommended IDE) (code editor):

```console
$ cd music-synchronizer
$ code .
```

**Trust the foldera and install all recommended extensions**

> Installation instructions for Visual Studio Code:  
> (Linux) `pacman -S code` (limited OSS version) / `yay -S visual-studio-code-bin` (Research required!)  
> (macOS) `brew install --cask visual-studio-code`  
> (Windows) `winget install -e --id Microsoft.VisualStudioCode`

Create a `.env.local` file and set the Cookie Secret (a 40 - 50 character long password)

```dotenv
COOKIE_SECRET=<40-50 character long password>
# you can generate a random 50-character string e.g. with `cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 50 | head -n 1`
```

Install the dependencies of the Project (You can open up a new terminal in Visua Studio Code with <kbd>Ctrl</kbd> + <kbd>J</kbd>):

```console
$ npm i
```

Setup the database

```console
$ npm run new
```

Start a local development server

```console
$ npm run dev
```

Happy hacking! 🥳
