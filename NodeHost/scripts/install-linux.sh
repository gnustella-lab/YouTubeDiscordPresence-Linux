#!/bin/sh

set -eu

HOST_NAME="com.ytdp.discord.presence"
DEFAULT_EXTENSION_ID="hnmeidgkfcbpjjjpmjmpehjdljlaeaaa"
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
NODE_HOST_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)

extension_id=$DEFAULT_EXTENSION_ID
browser=all
host_source="$NODE_HOST_DIR/dist/ytdp-native-host"
uninstall=false

usage() {
    cat <<'EOF'
Usage: install-linux.sh [options]

Options:
  --extension-id ID  Allow an unpacked/store extension ID.
  --browser NAME     all, chrome, chromium, chrome-for-testing, or helium (default: all).
  --host-path PATH   Install a prebuilt native host from PATH.
  --uninstall        Remove the per-user Linux installation.
  -h, --help         Show this help.
EOF
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        --extension-id)
            [ "$#" -ge 2 ] || { echo "Missing value for --extension-id" >&2; exit 2; }
            extension_id=$2
            shift 2
            ;;
        --browser)
            [ "$#" -ge 2 ] || { echo "Missing value for --browser" >&2; exit 2; }
            browser=$2
            shift 2
            ;;
        --host-path)
            [ "$#" -ge 2 ] || { echo "Missing value for --host-path" >&2; exit 2; }
            host_source=$2
            shift 2
            ;;
        --uninstall)
            uninstall=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            usage >&2
            exit 2
            ;;
    esac
done

[ "$(uname -s)" = "Linux" ] || { echo "This installer only supports Linux." >&2; exit 1; }

case "$extension_id" in
    *[!a-p]*|'')
        echo "Invalid Chrome extension ID: $extension_id" >&2
        exit 2
        ;;
esac
[ "${#extension_id}" -eq 32 ] || { echo "Chrome extension IDs must contain 32 characters." >&2; exit 2; }

config_home=${XDG_CONFIG_HOME:-"$HOME/.config"}
data_home=${XDG_DATA_HOME:-"$HOME/.local/share"}
install_dir="$data_home/youtube-discord-presence"
installed_host="$install_dir/ytdp-native-host"
manifest_name="$HOST_NAME.json"

manifest_dirs() {
    case "$browser" in
        all)
            printf '%s\n' \
                "$config_home/google-chrome/NativeMessagingHosts" \
                "$config_home/chromium/NativeMessagingHosts" \
                "$config_home/google-chrome-for-testing/NativeMessagingHosts" \
                "$config_home/net.imput.helium/NativeMessagingHosts"
            ;;
        chrome)
            printf '%s\n' "$config_home/google-chrome/NativeMessagingHosts"
            ;;
        chromium)
            printf '%s\n' "$config_home/chromium/NativeMessagingHosts"
            ;;
        chrome-for-testing)
            printf '%s\n' "$config_home/google-chrome-for-testing/NativeMessagingHosts"
            ;;
        helium)
            printf '%s\n' "$config_home/net.imput.helium/NativeMessagingHosts"
            ;;
        *)
            echo "Unsupported browser: $browser" >&2
            exit 2
            ;;
    esac
}

if [ "$uninstall" = true ]; then
    manifest_dirs | while IFS= read -r directory; do
        rm -f -- "$directory/$manifest_name"
    done
    rm -rf -- "$install_dir"
    echo "YouTubeDiscordPresence native host removed for $browser."
    exit 0
fi

[ -f "$host_source" ] || {
    echo "Native host not found: $host_source" >&2
    echo "Build it first with: npm run compile:linux" >&2
    exit 1
}
[ -x "$host_source" ] || { echo "Native host is not executable: $host_source" >&2; exit 1; }

mkdir -p -- "$install_dir"
install -m 0755 -- "$host_source" "$installed_host"

escaped_host=$(printf '%s' "$installed_host" | sed 's/\\/\\\\/g; s/"/\\"/g')
manifest=$(printf '{\n  "name": "%s",\n  "description": "YouTubeDiscordPresence native messaging host",\n  "path": "%s",\n  "type": "stdio",\n  "allowed_origins": [\n    "chrome-extension://%s/"\n  ]\n}\n' "$HOST_NAME" "$escaped_host" "$extension_id")

manifest_dirs | while IFS= read -r directory; do
    mkdir -p -- "$directory"
    printf '%s\n' "$manifest" > "$directory/$manifest_name"
    chmod 0644 "$directory/$manifest_name"
    echo "Registered native host: $directory/$manifest_name"
done

echo "Installed native host: $installed_host"
echo "Restart the browser to load the native messaging manifest."
