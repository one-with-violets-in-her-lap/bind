# Bind

Browser extension that lets you bind a hotkey to any button on any site

![Bind extension demo GIF](https://github.com/user-attachments/assets/5df02a64-5c5f-4d02-814a-056ddc536bd8)

> ⚠️ The extension is currently in early development. Expect new features - scroll, input and browser actions (e.g. new tab)
on key press

## Installation

### Chrome

Download [`bind-chrome.zip`](https://github.com/one-with-violets-in-her-lap/bind/releases/latest) archive and extract it

Go to `chrome://extensions` page and enable the developer mode. Then, press the "Load unpacked" button and choose the extracted folder

<img width="798" height="107" alt="Screenshot_20251010_202609" src="https://github.com/user-attachments/assets/f836e4be-3ac7-4a42-9a1c-284a7613e2f1" />

### Firefox

[🍁 Install from Firefox Add-ons](https://addons.mozilla.org/firefox/addon/bind/)

### Manual

1. Install [bun](https://bun.sh/)

2. Install deps

   ```sh
   bun i
   ```

3. Build the extension with manifest v2 or v3

   ```sh
   BIND_MANIFEST_VERSION=v2 BIND_MODE=production bun run build
   ```

After steps above, you will have an unpacked extension in a `dist` directory. You can load it or pack it in a CRX file in the browser
