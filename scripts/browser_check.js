// Browser checks: run a local HTTP server, then set MODULE_URL if not using port 8765.
const {chromium} = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('assert/strict');
const fs = require('fs');
const out = process.env.QA_OUTPUT || '/tmp/laboratory-equity-browser-qa';
fs.mkdirSync(out,{recursive:true});
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:true});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const http=require('http'),path=require('path');
  const server=process.env.MODULE_URL ? null : http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(path.join(__dirname,'../docs/index.html')))});
  if(server)await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url=process.env.MODULE_URL || `http://127.0.0.1:${server.address().port}/docs/index.html`;
  await page.goto(url);await page.waitForFunction(()=>document.querySelectorAll('iframe').length===11 && [...document.querySelectorAll('iframe')].every(f=>f.contentDocument?.querySelector('main')));
  await page.screenshot({path:out+'/welcome-desktop.png',fullPage:true});
  // Actual keyboard entry: skip link and navigation remain operable.
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Skip to module content');
  await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'frames');
  const failures=[];
  async function scan(section,stage){
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    for(const v of axe.violations)failures.push({section,stage,id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))});
  }
  for(let section=0;section<11;section++){
    await page.evaluate(i=>show(i),section);
    const frame=page.frames()[section+1];
    // No page-level horizontal overflow on desktop.
    assert(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Desktop overflow ${section}`);
    const forms=await frame.locator('form[data-key]').count();
    for(let j=0;j<forms;j++){
      // Navigate/reveal using the existing skip controls to make each next question reachable.
      const f=frame.locator('form[data-key]').nth(j);
      if(section===1)await f.evaluate(form=>show([...document.querySelectorAll('.panel')].indexOf(form.closest('.panel'))));
      if(await f.isVisible()){
        const key=await f.getAttribute('data-key');
        await f.locator(`input[value="${key}"]`).check();
        await f.locator('button[type=submit]').click();
        assert.equal(await f.getAttribute('data-result'),'correct');
        await scan(section,`question-${j+1}`);
      }
      const skip=f.locator('.skip-question');
      if(await skip.isVisible())await skip.click();
    }
    // Reveal all remaining staged content through controls for accessibility inspection.
    if(section===1)await frame.evaluate(()=>show(4));
    for(let n=0;n<8;n++){
      const next=frame.locator('.continue:not([hidden]),#reveal:not([hidden]),#follow:not([hidden])');
      let clicked=false;
      for(let j=0;j<await next.count();j++){if(await next.nth(j).isVisible()){await next.nth(j).click();clicked=true;break;}}
      if(!clicked)break;
    }
    await scan(section,'ending');
  }
  assert.equal(await page.evaluate(()=>{[...document.querySelectorAll('iframe')].forEach(f=>f.contentWindow.saveModuleProgress?.());return scoreSummary().answered}),23);
  // Separate fresh-context skip exercise so answered items do not mask skip problems.
  const skipContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const skipped=await skipContext.newPage();await skipped.goto(url);
  let skippedCount=0;
  await skipped.waitForFunction(()=>document.querySelectorAll('iframe').length===11 && [...document.querySelectorAll('iframe')].every(f=>f.contentDocument?.querySelector('main')));
  for(let section=1;section<=9;section++){
    await skipped.evaluate(i=>show(i),section);const frame=skipped.frames()[section+1];
    // Invoke every skip control, and verify it leaves explanations unscored.
    const count=await frame.locator('.skip-question').count();
    for(let i=0;i<count;i++){
      if(section===1)await frame.evaluate(i=>{const form=document.querySelectorAll('form')[i];show([...document.querySelectorAll('.panel')].indexOf(form.closest('.panel')))},i);
      const button=frame.locator('.skip-question').nth(i);
      assert(await button.isVisible(),`Skip control reachable ${section}.${i}`);
      await button.click();skippedCount++;
    }
  }
  assert.equal(skippedCount,24);
  await skipped.evaluate(()=>{[...document.querySelectorAll('iframe')].forEach(f=>f.contentWindow.saveModuleProgress?.());});
  assert.equal(await skipped.evaluate(()=>scoreSummary().answered),0);
  await skipped.evaluate(()=>show(10));await skipped.locator('#mark-complete').click();
  assert(await skipped.locator('#completion-message').isVisible());
  await skipContext.close();
  // Completion without answering anything is permitted and clearly self-reported.
  await page.evaluate(()=>show(10));await page.locator('#mark-complete').click();
  assert(await page.locator('#completion-message').isVisible());
  await scan(10,'participation');
  await page.locator('#participant-name').fill('Ini <script>alert(1)</script> Ntukidem');
  const html=await page.evaluate(()=>acknowledgmentHTML());
  assert(html.includes('&lt;script&gt;'));assert(!html.includes('<script>alert'));
  assert(!await page.evaluate(()=>localStorage.getItem('lab-equity-module-progress-v1').includes('Ntukidem')));
  const download=page.waitForEvent('download');await page.locator('#download-acknowledgment').click();
  const file=await download;assert(file.suggestedFilename().endsWith('.html'));await file.saveAs(out+'/acknowledgment.html');
  await page.locator('#participant-name').fill('Ini Ntukidem');
  const popupEvent=page.waitForEvent('popup');await page.locator('#print-acknowledgment').click();
  const popup=await popupEvent;await popup.waitForLoadState();
  assert((await popup.locator('main').innerText()).includes('self-reported participation'));
  await popup.pdf({path:out+'/acknowledgment.pdf',format:'Letter',printBackground:true});
  await popup.screenshot({path:out+'/acknowledgment.png',fullPage:true});await popup.close();
  await page.screenshot({path:out+'/completion-desktop.png',fullPage:true});
  await page.reload();await page.waitForFunction(()=>window.renderParticipation);
  assert(await page.locator('#completion-message').isVisible());
  assert.equal(await page.locator('#participant-name').inputValue(),'');
  await page.locator('#feedback-open').click();assert(await page.locator('#feedback-dialog').isVisible());
  await scan(10,'feedback-dialog');
  const feedback=page.waitForEvent('download');await page.locator('#download-feedback').click();await (await feedback).saveAs(out+'/feedback.txt');
  await page.locator('#feedback-close').click();assert.equal(await page.locator(':focus').getAttribute('id'),'feedback-open');
  // Escape dismissal of native dialogs.
  await page.locator('#feedback-open').click();await page.keyboard.press('Escape');assert(!await page.locator('#feedback-dialog').isVisible());
  for(const width of [390,320]){
    await page.setViewportSize({width,height:844});
    for(let section=0;section<11;section++){
      await page.evaluate(i=>show(i),section);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Shell overflow ${width} ${section}`);
      const frame=page.frames()[section+1];
      assert(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Frame overflow ${width} ${section}`);
      if(width===390 && [0,6,10].includes(section))await page.screenshot({path:`${out}/mobile-${section}.png`,fullPage:true});
    }
  }
  await page.locator('#reset').click();await page.locator('#confirm-reset').click();
  await page.evaluate(()=>show(10));assert(await page.locator('#mark-complete').isVisible());assert(!await page.locator('#completion-message').isVisible());
  fs.writeFileSync(out+'/accessibility-findings.json',JSON.stringify(failures,null,2));
  assert.equal(errors.length,0,errors.join('\n'));
  await browser.close();
  if(server)await new Promise(resolve=>server.close(resolve));
  console.log(JSON.stringify({browserChecks:'passed',accessibilityViolations:failures.length,output:out}));
  if(failures.length)process.exitCode=2;
})().catch(e=>{console.error(e);process.exit(1)});
