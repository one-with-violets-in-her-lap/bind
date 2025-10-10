# Bind

Browser extension that lets you bind a hotkey to any button on any site

![Bind extension demo GIF](https://github.com/user-attachments/assets/5df02a64-5c5f-4d02-814a-056ddc536bd8)

## Installation

TODO: installation from stores/CRX files

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
