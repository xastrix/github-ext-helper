<h1>github-ext-helper</h1>
<p>This extension allows you to get more information from a user's Github profile about repositories</p>
<h2>Showcase</h2>
<div align="center">
  <img src="https://github.com/xastrix/github-ext-helper/blob/master/media/before.png">
  <img src="https://github.com/xastrix/github-ext-helper/blob/master/media/after.png">
</div>
<h2>Installation</h2>
<p>Clone the repository</p>
<pre>git clone https://github.com/xastrix/github-ext-helper.git</pre>
<div>Open <a href="https://github.com/settings/tokens">Developer Settings</a> and click the "Generate New Token (classic)" button (See screenshot on the right)</div>
<div><img align="right" src="https://github.com/xastrix/github-ext-helper/blob/master/media/generate-new-token.png"></div> <hr>
<div><p>Open <a href="https://github.com/xastrix/github-ext-helper/blob/master/src/js/helper.js#L1">helper.js</a> and insert the token in the brackets</p></div>
<div><pre>const user_token = 'YOUR_TOKEN_HERE';</pre></div>
<div>Once you have installed your token, open Chrome and go to <kbd>chrome://extensions/</kbd> and enable developer mode by toggling the switch in the top right corner</div>
<div>Click on "Load unpacked" and select the directory named "src" in the window that appears</div>
<div>Once loaded, the extension should appear in your browser’s extensions list. You need to enable it by switching toggle</div>
<div>Once enabled, go back to the github and press <kbd>F5</kbd> (To refresh the page)</div>
<h2>License</h2>
<a href="https://github.com/xastrix/github-ext-helper/tree/master/LICENSE">MIT</a>