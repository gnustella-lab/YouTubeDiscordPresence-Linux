## Installation

<p align="left">
    <a href="https://chrome.google.com/webstore/detail/youtubediscordpresence/hnmeidgkfcbpjjjpmjmpehjdljlaeaaa" alt="Chrome Extension">
        <img src="https://img.shields.io/badge/Chrome%20Web%20Store-21%2C000%2B%20Users-critical" /></a>
    <a href="https://chrome.google.com/webstore/detail/youtubediscordpresence/hnmeidgkfcbpjjjpmjmpehjdljlaeaaa" alt="Category: Social & Communication">
        <img src="https://img.shields.io/badge/Total%20Installs-71%2C000%2B-blue" /></a>
</p>

If you've already downloaded the extension, **skip the first step!**

1. Add the [<ins>**Chrome Extension**</ins>](https://chrome.google.com/webstore/detail/youtubediscordpresence/hnmeidgkfcbpjjjpmjmpehjdljlaeaaa) from the Chrome Web Store.

   - To access personalization settings, click on the extension icon in your browser's extension menu at the top right corner of your browser.

2. Install the secondary desktop component for your operating system.

   - **Windows (x64):** Download the latest `YTDPsetup.msi` file from
     [**<ins>releases</ins>**](https://github.com/XFG16/YouTubeDiscordPresence/releases) and run it.
   - **Linux (x64 or arm64):** Build and register the native host for your user:

     ```sh
     cd NodeHost
     npm ci
     npm run compile:linux
     npm run install:linux
     ```

     Restart Chrome or Chromium after installation. The installer registers the host in the user-level profiles for
     Google Chrome, Chrome for Testing, and Chromium; it does not require `sudo`.

     If you loaded the extension unpacked, copy its ID from `chrome://extensions` and install with:

     ```sh
     npm run install:linux -- --extension-id YOUR_32_CHARACTER_EXTENSION_ID
     ```

Still confused? Watch the **installation tutorial** on YouTube using [**<ins>this link</ins>**](https://www.youtube.com/watch?v=BWPNqPGFyL4).

---

# YouTubeDiscordPresence for Windows and Linux

<p align="left">
    <a href="https://chrome.google.com/webstore/detail/youtubediscordpresence/hnmeidgkfcbpjjjpmjmpehjdljlaeaaa" alt="Category: Social & Communication">
        <img src="https://img.shields.io/badge/Category-Social%20%26%20Communication-blueviolet" /></a>
    <a href="https://github.com/XFG16/YouTubeDiscordPresence#license" alt="MIT License">
        <img src="https://img.shields.io/badge/License-MIT-yellow" /></a>
</p>

**YouTubeDiscordPresence** (YTDP) is an application and browser extension used to create a detailed rich presence for YouTube and YouTube Music on Discord. **Windows (x64)** and **Linux (x64/arm64)** are supported.

<br>

<img height="350px" src="Screenshots/newUiExample.png">

---

## Troubleshooting/Known Issues

- The `Listen Along` and `View Channel` buttons in the rich presence don't show when looking at your own profile, but it will show for others. See the example image above. This is a Discord [**<ins>limitation</ins>**](https://github.com/discordjs/RPC/issues/180#issuecomment-2313232518).

- YouTubeDiscordPresence only works with the desktop application of Discord, **not the browser version.**

- Ensure that the `Share my activity` setting under `Activity Privacy` is **turned on.**

- The rich presence may randomly disappear and reappear within a few seconds due to Chrome forcibly unloading and reloading `background.js` in Manifest v3.

You should try fully closing your browser and Discord (from the system tray), and then reopening them.

---

## Bugs, Feature Requests, or Support

Go [here](https://github.com/XFG16/YouTubeDiscordPresence/issues/new/choose) and follow the template!

---

## Building

Desktop application:

   - Install dependencies from `NodeHost` with `npm ci`.
   - Run the tests with `npm test`.
   - Windows: run `npm run compile`, then replace the existing `YTDPwin.exe` in
     `C:\Program Files\YouTubeDiscordPresence` with the newly compiled one.
   - Linux for the current architecture: run `npm run compile:linux` followed by `npm run install:linux`.
   - Linux cross-targets: use `npm run compile:linux:x64` or `npm run compile:linux:arm64`.
   - Remove the per-user Linux host with `npm run uninstall:linux`.

   - Building the `.msi`: Download **Visual Studio 2026** with the **Microsoft Visual Studio Installer Project** extension. Open `Host\YTDPwin\YTDPsetup\YTDPsetup.vdproj` and build `YTDPsetup`.

Extension:
   - Download the `Extension` directory, compress it into a zip, and load it onto your browser manually.

   - Make sure that the `"allowed_origins"` key in the JSON file involved in
     [**<ins>native messaging</ins>**](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)
     contains the extension's ID. On Windows this is the installed `main.json`; on Linux, pass the ID to
     `install-linux.sh` with `--extension-id`.

---

## Maintainers

- **Charles Kim** ([@charleskimbac](https://github.com/charleskimbac))

---

## Miscellaneous

**DISCLAIMER:** this is not a bootleg copy of PreMiD. On a more technical note, it works similar to the Spotify rich presence—it only appears **when a video is playing** and **disappears when there is no video or the video is paused**. In addition, it only displays the presence for videos. Idling and searching are **not displayed**. Features such as exclusions, fully customizable details, and thumbnail coverage are **unique and original** to YouTubeDiscordPresence. YouTubeDiscordPresence has not referenced nor is affiliated with PreMiD in any way whatsoever.

---

## License

Licensed under the [MIT](https://github.com/XFG16/YouTubeDiscordPresence/blob/main/LICENSE.txt) license.
