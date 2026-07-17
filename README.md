# YouTubeDiscordPresence Linux

Linux-focused fork of [XFG16/YouTubeDiscordPresence](https://github.com/XFG16/YouTubeDiscordPresence), with a native host for **Linux x64/arm64** and first-class support for **Helium Browser**, Google Chrome, Chromium, and Chrome for Testing.

The browser extension keeps the upstream `YouTubeDiscordPresence` name and protocol for compatibility. Linux packaging, installation, native messaging, and Helium integration are maintained in this fork.

## Installation on Linux

<p align="left">
    <a href="https://chrome.google.com/webstore/detail/youtubediscordpresence/hnmeidgkfcbpjjjpmjmpehjdljlaeaaa" alt="Chrome Extension">
        <img src="https://img.shields.io/badge/Chrome%20Web%20Store-21%2C000%2B%20Users-critical" /></a>
    <a href="https://chrome.google.com/webstore/detail/youtubediscordpresence/hnmeidgkfcbpjjjpmjmpehjdljlaeaaa" alt="Category: Social & Communication">
        <img src="https://img.shields.io/badge/Total%20Installs-71%2C000%2B-blue" /></a>
</p>

1. Add the [<ins>**Chrome Extension**</ins>](https://chrome.google.com/webstore/detail/youtubediscordpresence/hnmeidgkfcbpjjjpmjmpehjdljlaeaaa) from the Chrome Web Store, or load this repository's `Extension` directory as an unpacked extension.

   - To access personalization settings, click on the extension icon in your browser's extension menu at the top right corner of your browser.

2. Build and register the Linux native host for your user:

     ```sh
     cd NodeHost
     npm ci
     npm run compile:linux
     npm run install:linux
     ```

     Restart the browser after installation. The installer registers the host in the user-level profiles for
     **Helium Browser**, Google Chrome, Chrome for Testing, and Chromium; it does not require `sudo`.

     If you loaded the extension unpacked, copy its ID from `chrome://extensions` and install with:

     ```sh
     npm run install:linux -- --extension-id YOUR_32_CHARACTER_EXTENSION_ID
     ```

     Helium's extension ID is available at `helium://extensions`. The installer writes its Native Messaging manifest to `~/.config/net.imput.helium/NativeMessagingHosts` automatically. To install only for Helium, add `--browser helium`.

Still confused? Watch the **installation tutorial** on YouTube using [**<ins>this link</ins>**](https://www.youtube.com/watch?v=BWPNqPGFyL4).

---

# About this fork

<p align="left">
    <a href="https://chrome.google.com/webstore/detail/youtubediscordpresence/hnmeidgkfcbpjjjpmjmpehjdljlaeaaa" alt="Category: Social & Communication">
        <img src="https://img.shields.io/badge/Category-Social%20%26%20Communication-blueviolet" /></a>
    <a href="https://github.com/gnustella-lab/YouTubeDiscordPresence-Linux#license" alt="MIT License">
        <img src="https://img.shields.io/badge/License-MIT-yellow" /></a>
</p>

**YouTubeDiscordPresence** (YTDP) is an application and browser extension used to create a detailed rich presence for YouTube and YouTube Music on Discord. This fork targets **Linux (x64/arm64)** and Chromium-family browsers, including **Helium**. For the original project and Windows installer, visit [XFG16/YouTubeDiscordPresence](https://github.com/XFG16/YouTubeDiscordPresence).

<br>

<img height="350px" src="Screenshots/newUiExample.png">

---

## Troubleshooting/Known Issues

- The `Listen Along` and `View Channel` buttons in the rich presence don't show when looking at your own profile, but it will show for others. See the example image above. This is a Discord [**<ins>limitation</ins>**](https://github.com/discordjs/RPC/issues/180#issuecomment-2313232518).

- YouTubeDiscordPresence only works with the desktop application of Discord, **not the browser version.**

- Helium is supported through its native messaging profile. When using an unpacked extension, reinstall the host with the extension ID shown at `helium://extensions`.

- Ensure that the `Share my activity` setting under `Activity Privacy` is **turned on.**

- The rich presence may randomly disappear and reappear within a few seconds due to Chrome forcibly unloading and reloading `background.js` in Manifest v3.

You should try fully closing your browser and Discord (from the system tray), and then reopening them.

---

## Bugs, Feature Requests, or Support

For Linux or Helium problems, open an issue in [this fork](https://github.com/gnustella-lab/YouTubeDiscordPresence-Linux/issues/new/choose). For upstream or Windows problems, use the [original project](https://github.com/XFG16/YouTubeDiscordPresence/issues/new/choose).

---

## Building

Desktop application:

   - Install dependencies from `NodeHost` with `npm ci`.
   - Run the tests with `npm test`.
   - Linux for the current architecture: run `npm run compile:linux` followed by `npm run install:linux`.
   - Linux cross-targets: use `npm run compile:linux:x64` or `npm run compile:linux:arm64`.
   - Remove the per-user Linux host with `npm run uninstall:linux`.

Extension:
   - Download the `Extension` directory, compress it into a zip, and load it onto your browser manually.

   - Make sure that the `"allowed_origins"` key in the JSON file involved in
     [**<ins>native messaging</ins>**](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)
     contains the extension's ID. On Windows this is the installed `main.json`; on Linux, pass the ID to
     `install-linux.sh` with `--extension-id`.

---

## Maintainers

- **gnustella-lab** — Linux and Helium fork
- **Charles Kim** ([@charleskimbac](https://github.com/charleskimbac))

---

## Miscellaneous

**DISCLAIMER:** this is not a bootleg copy of PreMiD. On a more technical note, it works similar to the Spotify rich presence—it only appears **when a video is playing** and **disappears when there is no video or the video is paused**. In addition, it only displays the presence for videos. Idling and searching are **not displayed**. Features such as exclusions, fully customizable details, and thumbnail coverage are **unique and original** to YouTubeDiscordPresence. YouTubeDiscordPresence has not referenced nor is affiliated with PreMiD in any way whatsoever.

---

## License

Licensed under the [MIT](https://github.com/gnustella-lab/YouTubeDiscordPresence-Linux/blob/main/LICENSE.txt) license. Original project copyright and attribution are preserved.
