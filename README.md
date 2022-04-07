## Get Started 💨

Klone das repo mit git:

```console
$ cd ~/Folder/you/want/to/clone/this/repository/into
$ git clone https://github.com/check24-scholarships/music-synchronizer.git
```

> Tip: Use <kbd>Tab</kbd> to complete terminal commands and show suggestions

Öffne das Projekt in [Visual Studio Code](https://code.visualstudio.com/), (recommended IDE) (code editor):

```console
$ code lsg
```

**Vertraue dem Ordner und installiere alle recommended extensions**

> Installation instructions for Visual Studio Code:  
> (Linux) `pacman -S code` (limited OSS version) / `yay -S visual-studio-code-bin` (Research required!)  
> (macOS) `brew install --cask visual-studio-code`  
> (Windows) `winget install -e --id Microsoft.VisualStudioCode`

Installiere die dependencies vom Projekt (Du kannst in Visual Studio Code ein Terminal mit <kbd>Ctrl</kbd> + <kbd>J</kbd> öffnen):

```console
$ npm i
```

Setzte die Datenbank auf

```
$ npm run new
```

Starte einen lokalen development Server

```console
$ npm run dev
```

Happy hacking! 🥳
