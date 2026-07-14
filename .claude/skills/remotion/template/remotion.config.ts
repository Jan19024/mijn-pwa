import {Config} from '@remotion/cli/config';
import fs from 'node:fs';
import path from 'node:path';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Claude Code cloud environments ship Playwright browsers at /opt/pw-browsers;
// pointing Remotion at the bundled chrome-headless-shell avoids downloading a
// browser at render time. Elsewhere this is a no-op and Remotion manages its
// own browser as usual.
const pwBrowsers = '/opt/pw-browsers';
if (fs.existsSync(pwBrowsers)) {
  const shellDir = fs
    .readdirSync(pwBrowsers)
    .find((d) => d.startsWith('chromium_headless_shell'));
  if (shellDir) {
    const shell = path.join(pwBrowsers, shellDir, 'chrome-linux', 'headless_shell');
    if (fs.existsSync(shell)) {
      Config.setBrowserExecutable(shell);
    }
  }
}
