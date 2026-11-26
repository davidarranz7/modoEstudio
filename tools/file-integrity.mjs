import {createHash} from 'node:crypto';

/** Compare text identically on Windows and Linux; binary assets remain byte-exact. */
export function fileContentHash(path,bytes){
 const text=/\.(?:ts|mjs|js|json|webmanifest|html?|css|md|php|txt|ya?ml)$|(?:^|\/)\.htaccess$/i.test(path);
 const content=text?bytes.toString('utf8').replace(/\r\n/g,'\n'):bytes;
 return createHash('sha256').update(content).digest('hex');
}
