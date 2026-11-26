import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {playwright,chromeLaunchOptions} from './browser-test-support.mjs';
import {serveWorkspace} from './workspace-test-server.mjs';

const source=await readFile('src/app/data/dwcs.questions.ts','utf8');
const questions=JSON.parse(source.match(/Question\[\] = (\[[\s\S]*\]);/)[1]);
const webkit=process.argv.includes('--webkit'),name=webkit?'webkit':'chrome';
const server=await serveWorkspace(),browser=await(webkit?playwright.webkit:playwright.chromium).launch(webkit?{headless:true}:chromeLaunchOptions());
try{
 const page=await browser.newPage({...playwright.devices['iPhone 13']}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(server.url+'/inicio');
 const open=async id=>{
  const question=questions.find(q=>q.id===id);assert(question);
  await page.evaluate(q=>localStorage.setItem('estudio-php-session-v1',JSON.stringify({ids:[q.id],pointer:0,selected:[],draft:'Mi respuesta conservada',revealed:false,graded:false,lastGrade:null,good:0,medium:0,bad:0,completed:false,history:[],answers:[],files:q.starterFiles?{'index.php':'<?php echo "Mi borrador";'}:{},config:{subjectId:'dwcs',units:[q.unit],mode:'mixed',level:'all',count:1,source:'all',content:'all',withImages:false,weakOnly:false,strict:false}})),question);
  await page.goto(server.url+'/estudiar');return question;
 };
 await open('DWCS-R17-U2-167');
 await page.locator('app-code-snippet .snippet-keyword').first().waitFor();
 const shown=(await page.locator('.snippet-text').allTextContents()).join('\n');
 assert.match(shown,/\$a = 5;\n\nwhile \(\$a < 3\) \{\n    echo "W";\n\}/);
 assert.match(shown,/do \{\n    echo "D";\n\} while \(\$a < 3\);/);
 assert.equal(await page.locator('app-php-runner,[contenteditable=true],.expected-output-answer').count(),0,'Prediction never exposes execution or the answer');
 await mkdir('test-results',{recursive:true});
 await page.locator('app-code-snippet').screenshot({path:`test-results/code-reading-${name}.png`});
 await page.getByRole('button',{name:'Ver salida y explicación',exact:true}).click();
 const reference=page.locator('.reference-preview'),frame=reference.frameLocator('iframe');
 await frame.locator('body').filter({hasText:/^D$/}).waitFor({timeout:45000});
 assert.equal(await reference.getByRole('tab',{name:'Vista HTML',exact:true}).getAttribute('aria-selected'),'true');
 assert.equal(await page.locator('.own-draft pre').innerText(),'Mi respuesta conservada');

 const formQuestion=await open('DWCS-R17-U2-268');
 await page.locator('.cm-content[contenteditable=true]').waitFor();
 await page.getByRole('button',{name:'Ver solución',exact:true}).click();
 await page.locator('.answer app-code-snippet .snippet-variable').first().waitFor();
 const solution=(await page.locator('.answer .snippet-text').allTextContents()).join('\n');
 assert.match(solution,/foreach \(\$prendas as \$prenda\) \{\n    if/);
 assert.match(solution,/<form method="get" action="">\n    <input/);
 await frame.locator('span[style]').filter({hasText:'#ff0000'}).waitFor({timeout:45000});
 assert.match(await frame.locator('body').innerText(),/camiseta\s+chaqueta/);
 assert.equal(await frame.locator('span[style]').evaluate(element=>getComputedStyle(element).backgroundColor),'rgb(255, 0, 0)');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('estudio-php-session-v1')).files['index.php']),'<?php echo "Mi borrador";');
 await frame.locator('input[value="chaqueta"]').check();
 await frame.locator('input[type="color"]').fill('#0055ff');
 await frame.getByRole('button',{name:'Enviar',exact:true}).click();
 await frame.locator('span[style]').filter({hasText:'#0055ff'}).waitFor();
 assert.equal(await frame.locator('span[style]').evaluate(element=>getComputedStyle(element).backgroundColor),'rgb(0, 85, 255)');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No mobile page overflow');
 await page.screenshot({path:`test-results/solution-html-${name}.png`,fullPage:true});
 assert.equal(formQuestion.solution.includes("$prendas=$_GET"),true,'Original reference remains unformatted in the bank');

 const functionQuestion=await open('DWCS-R17-U2-262');
 await page.locator('.cm-content[contenteditable=true]').waitFor();
 await page.getByRole('button',{name:'Ver solución',exact:true}).click();
 await frame.locator('pre').filter({hasText:String(functionQuestion.phpTests[0].expected)}).waitFor({timeout:45000});
 assert.match(await reference.innerText(),/Se muestra el valor devuelto/);
 assert.deepEqual(errors,[],'No browser errors');
 console.log(`${name}: PHP con saltos y sangría; solución con el mismo estilo; HTML real D, GET de prendas/color y nueva petición; llamada de función real; borrador conservado y sin desbordamiento a 390px.`);
}finally{await browser.close();server.close();}
