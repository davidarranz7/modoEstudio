import {existsSync} from 'node:fs';
import {join} from 'node:path';

// npm ci supplies the normal dependency; the fallback supports earlier local runs.
let loaded;
try { loaded=await import('playwright'); }
catch { loaded=await import('../.runtime-test-deps/node_modules/playwright/index.mjs'); }
export const playwright=loaded;
export const {chromium,webkit,devices}=playwright;

/** Use an explicit browser, an installed Windows Chrome, or Playwright Chromium. */
export function chromeLaunchOptions(overrides={}) {
  let executablePath=process.env.CHROME_PATH;
  if(!executablePath&&process.platform==='win32') {
    const candidates=[
      join(process.env.ProgramFiles??'C:/Program Files','Google','Chrome','Application','chrome.exe'),
      join(process.env['ProgramFiles(x86)']??'C:/Program Files (x86)','Google','Chrome','Application','chrome.exe'),
      ...(process.env.LOCALAPPDATA?[join(process.env.LOCALAPPDATA,'Google','Chrome','Application','chrome.exe')]:[]),
    ];
    executablePath=candidates.find(path=>existsSync(path));
  }
  return {headless:true,...(executablePath?{executablePath}:{}),...overrides};
}
