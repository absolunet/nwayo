<!doctype html>
<html id="fr-CA" lang="fr" data-kafe-page="SpecialContent" data-kafe-tmpl="Content Patate">
<head>
	<title>Base page html5</title>

	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport"              content="width=device-width">

	<!-- MOBILE
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" /> 
	<meta name="format-detection" content="telephone=no" />
	-->

	<style>
		<?php
			include 'lessc.inc.php'; 
	
			$less = new lessc;
			try {
				echo $less->compileFile('less/loader.less');
			} catch (exception $e) {
				echo "fatal error: " . $e->getMessage();
			}
		?>
	</style>



	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
	<script src="//code.jquery.com/jquery-migrate-1.1.0.js"></script>
	<?php /*

	<!--[if lt IE 9]>
	    <script src="jquery-1.9.0.js"></script>
	<![endif]-->
	<!--[if gte IE 9]><!-->
	    <script src="//code.jquery.com/jquery-2.0.0b1.js"></script>
	<!--[endif]-->
	
	*/ ?>
	<script src="../../kafe/branches/v2/plugins/underscore.js"></script>

	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>


	<script src="../../kafe/branches/v2/kafe/kafe.js"></script>

	<script src="//s7.addthis.com/js/300/addthis_widget.js#pubid=TODO&amp;async=1"></script>
	<script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
	<script src="//platform.twitter.com/widgets.js"></script>
	<script src="//maps.google.com/maps/api/js?sensor=true"></script>

	<script src="../../kafe/branches/v2/plugins/accounting.js"></script>
	<script src="../../kafe/branches/v2/plugins/ajaxupload.js"></script>
	<script src="../../kafe/branches/v2/plugins/cssua.js"></script>
	<script src="../../kafe/branches/v2/plugins/json2.js"></script>
	<script src="../../kafe/branches/v2/plugins/markerclusterer.js"></script>
	<script src="../../kafe/branches/v2/plugins/modernizr.js"></script>
	<script src="../../kafe/branches/v2/plugins/qrcode.js"></script>
	<script src="../../kafe/branches/v2/plugins/simplexml.js"></script>
	<script src="../../kafe/branches/v2/plugins/imageflow.custom/imageflow.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/bbq.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/blend.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/cookie.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/hashchange.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/inputmask.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/iviewer.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/json.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/mobile-gestures.custom.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/mobile.custom.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/scrollto.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/textselect.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/tmpl.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/colorbox/colorbox.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/jscrollpane/mousewheel.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/jscrollpane/mwheelIntent.js"></script>
	<script src="../../kafe/branches/v2/plugins/jquery/jscrollpane/jscrollpane.js"></script>

	<script src="../../kafe/branches/v2/kafe/array.js"></script>
	<script src="../../kafe/branches/v2/kafe/date.js"></script>
	<script src="../../kafe/branches/v2/kafe/form.js"></script>
	<script src="../../kafe/branches/v2/kafe/geolocation.js"></script>
	<script src="../../kafe/branches/v2/kafe/mobile.js"></script>
	<script src="../../kafe/branches/v2/kafe/number.js"></script>
	<script src="../../kafe/branches/v2/kafe/storage.js"></script>
	<script src="../../kafe/branches/v2/kafe/string.js"></script>
	<script src="../../kafe/branches/v2/kafe/string-encrypt.js"></script>
	<script src="../../kafe/branches/v2/kafe/string-validate.js"></script>
	<script src="../../kafe/branches/v2/kafe/style.js"></script>
	<script src="../../kafe/branches/v2/kafe/url.js"></script>

	<script src="../../kafe/branches/v2/kafe/plugin/carousel.js"></script>
	<script src="../../kafe/branches/v2/kafe/plugin/qrcode.js"></script>
	<script src="../../kafe/branches/v2/kafe/plugin/sticky.js"></script>
	<script src="../../kafe/branches/v2/kafe/plugin/webcropper.js"></script>

	<script src="../../kafe/branches/v2/kafe/extension/addthis.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/bbq.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/colorbox.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/disqus.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/facebook.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/flickr.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/googlemaps.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/googlemaps-styles.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/inputmask.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/soundcloud.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/twitter.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/youtube.js"></script>

	<script src="../../kafe/branches/v2/kafe/extension/cms/drupal.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/cms/magento.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/cms/medianamik.js"></script>
	<script src="../../kafe/branches/v2/kafe/extension/cms/sitecore.js"></script>


	<!--script src="../../kafe/branches/v2/tequila/tequila.js"></script>
		<script src="../../kafe/branches/v2/tequila/tween.js"></script-->	


	<!-- (c) 2013 Absolunet inc. -->
</head>
<body id="SpecialContent" class="Content">


	<div id="wrap">
	  <header>
	    <hgroup>
	      <!-- Example comment: Add valid elements within header group -->
	      <h1>HTML5 Elements</h1>
	      <p><a href="http://www.html5accessibility.com">home</a></p>
	    </hgroup>
	    <p>This is the global <code>&lt;header&gt;</code> element for this page, including the <code>&lt;hgroup&gt;</code> and <code>&lt;nav&gt;</code> elements.</p>
	    <nav>
	      <ul>
	        <li><a href="#" title="Global header link">Global <code>&lt;nav&gt;</code> link within the <code>&lt;header&gt;</code></a></li>
	        <li><a href="#" title="Global header link">Global <code>&lt;nav&gt;</code> link within the <code>&lt;header&gt;</code></a></li>
	        <li><a href="#" title="Global header link">Global <code>&lt;nav&gt;</code> link within the <code>&lt;header&gt;</code></a></li>
	      </ul>
	    </nav>
	  </header>
	  <section>
	    <header>
	      <h2>Section header</h2>
	    </header>
	    <article>
	      <header>
	        <h3>Article header</h3>
	      </header>
	      <div>
	        <p><a href="http://www.ackernaut.com/space-station/zip/html5-elements.zip" title="Download the HTML and asset files">Download the HTML and asset files</a> <br>
	          (ZIP does not include audio or video to reduce file size. <br>
	          You can download them from this page using your browser.)</p>
	        <h4>Purpose of this document:</h4>
	        <ul>
	          <li>Includes all the HTML5 elements as listed in the side column. </li>
	          <li>Minimal styling has been used. Use this document to test CSS files (base, reset, custom, etc.) on desired elements in various browsers.</li>
	          <li>Use this document to create comprehensive templates that need to use many of the common HTML5 elements.</li>
	          <li>Includes jQuery because it comes in handy.</li>
	          <li>Includes HTML5 compatibility for Internet Explorer.</li>
	          <li>Includes CSS files for screen, print, mobile and smart phones.</li>
	          <li>See <a href="#info" title="Reference links below">reference links below</a> for more information.</li>
	          <li>This page validates as HTML5.</li>
	        </ul>
	        <p><span>Note:</span> This is only a guide &mdash; a starting point &mdash; if you will.</p>
	        <hr>
	        <h1>Header 1 &lt;h1&gt;</h1>
	        <p>This is an example paragraph used within this article for this document.</p>
	        <h2>Header 2 &lt;h2&gt;</h2>
	        <p>This is an example paragraph used within this article for this document.</p>
	        <h3>Header 3 &lt;h3&gt;</h3>
	        <p>This is an example paragraph used within this article for this document.</p>
	        <h4>Header 1 &lt;h4&gt;</h4>
	        <p>This is an example paragraph used within this article for this document.</p>
	        <h5>Header &lt;h5&gt;</h5>
	        <p>This is an example paragraph used within this article for this document.</p>
	        <h6>Header &lt;h6&gt;</h6>
	        <p>This is an example paragraph used within this article for this document.</p>
	        <hr>
	        <h4>Unordered list</h4>
	        <ul>
	          <li>Unordered list item</li>
	          <li>Unordered list item
	            <ul>
	              <li>Unordered list item</li>
	              <li>Unordered list item
	                <ul>
	                  <li>Unordered list item</li>
	                  <li>Unordered list item</li>
	                  <li>Unordered list item</li>
	                </ul>
	              </li>
	              <li>Unordered list item</li>
	            </ul>
	          </li>
	          <li>Unordered list item</li>
	        </ul>
	        <h4>Ordered list</h4>
	        <ol>
	          <li>Ordered list item</li>
	          <li>Ordered list item
	            <ol>
	              <li>Ordered list item</li>
	              <li>Ordered list item
	                <ol>
	                  <li>Ordered list item</li>
	                  <li>Ordered list item</li>
	                  <li>Ordered list item</li>
	                </ol>
	              </li>
	              <li>Ordered list item</li>
	            </ol>
	          </li>
	          <li>Ordered list item</li>
	        </ol>
	        <hr>
	        <h4>Address and blockquote:</h4>
	        <address>
	        700 Address Element Road<br>
	        Town, State Zip
	        </address>
	        <blockquote>This is a blockquote.</blockquote>
	        <hr>
	        <h4>Audio and video:</h4>
	        <p>Example of the <code>&lt;audio&gt;</code> element:</p>
			<?php /*        
			<audio controls autobuffer tabindex="0" role="application" title="audio">
			 <source src="assets/audio/1.mp3">
	          <source src="assets/audio/kahvi285d_jim_black-yoctosecond.ogg">
	          <!-- Find the audio file here: http://www.kahvi.org/releases.php?release_number=285 -->
	          Your browser does not support OGG audio. Try using Safari, Chrome or Firefox.</audio>
			*/ ?>
	        <p>Example of the <code>&lt;video&gt;</code> element:</p>
	        <?php /*<video width="400" height="300" src="assets/video/a-new-computer-small.ogg" controls autobuffer tabindex="0"></video>*/ ?>
			<p>Example of the <code>&lt;video&gt;</code> element for IE9:</p>
			<?php /*<video src="assets/video/IE9_HTML5_8000k.mp4" width="400" height="300" controls AUTOBUFFER tabindex="0"></video>*/ ?>



	        <hr>
	        <h4>Figure:</h4>
	        <figure>
	          <p>Use an <code>&lt;img&gt;</code>, <code>&lt;video&gt;</code> or <code>&lt;table&gt;</code> as content for the <code>&lt;figure&gt;</code> element.</p>
	          <img src="assets/img/sky.jpg" width="240" height="160" alt="Watching the Sky by Nathaniel Reinhart"><br>
	          <figcaption><a href="http://www.flickr.com/photos/0mega/3178584649/" title="Watching the Sky by Nathaniel Reinhart">Watching the Sky</a> by Nathaniel Reinhart (<code>&lt;figcaption&gt;</code>)</figcaption>
	        </figure>
	        <hr>
	        <h4>Form:</h4>
	        <form>
	          <fieldset>
	          <legend>Form legend</legend>

			  <div class="entry">
	        <label for="form-1">Text (required &amp; autofocus) </label><br>
	        <input id="form-1"  name="haha" type="text" autofocus required>
	       </div>

			<div class="entry">
	        <label for="form-1a">Text with place holder</label><br>
	        <input id="form-1a"  name="hah" type="text" placeholder="place holder">
	 </div>

			<div class="entry">
	        <label for="form-1b">Search with place holder</label><br>
	        <input id="form-1b"  name="ha" type="search" placeholder="search">
	 </div>



	    <!-- entry end -->
	    <div class="entry">
	        <label for="form-2">Text with Datalist</label>
	        <input id="form-2"   list="mylist" type="text">
	        <datalist id="mylist">
	            <option label="Mr" value="Mr">
	            <option label="Ms" value="Ms">
	            <option label="Prof" value="Mad Professor"> 
	        </datalist>
	    </div>
	    <!-- entry end -->
	    <div class="entry">
	        <label for="form-4">Number</label>
	        <input id="form-4"  name="age" type="number" min="18" max="25">
	    </div>
	    <!-- entry end -->
	    <div class="entry">
	        <label for="form-5">Email</label>
	        <input id="form-5"  name="email" type="email">
	    </div>
	    <!-- entry end -->
	    <div class="entry">
	        <label for="form-6">URL</label>
	        <input id="form-6"  name="url" type="url">
	    </div>
	    <!-- entry end -->
		<div class="entry">
	        <label for="form-7">Date</label>
	        <input id="form-7"  name="dob" type="date">
	    </div>
	    <div class="entry">
	        <label for="form-8">Date Time</label>
	        <input id="form-8"  name="dt" type="datetime">
	    </div>

		<div class="entry">
	        <label for="form-9">Date Time-local</label>
	        <input id="form-9"  name="dtl" type="datetime-local">
	    </div>
		<div class="entry">
	        <label for="form-10">Month</label>
	        <input id="form-10"  name="m" type="month">
	    </div>

		<div class="entry">
	        <label for="form-11">Time</label>
	        <input id="form-11"  name="t" type="time">
	    </div>
		<div class="entry">
	        <label for="form-12">Week</label>
	        <input id="form-12"  name="w" type="week">
	    </div>
		<div class="entry">
	        <label for="form-13">Telephone</label>
	        <input id="form-13"  name="tel" type="tel">
	    </div>
	    <!-- entry end -->
	    <div class="entry">
	        <label for="form-14">Range</label>
	        <input id="form-14"  name="a" type="range" min="1" max="10" value="0">
	        output: <output name="result"  onforminput="value=a.value" aria-live="polite">0</output>
	    </div>

		<div class="entry">
	        <label for="form-15">Color</label>
	        <input id="form-15"  name="tel" type="color">
	    </div>

	    <!-- entry end -->
	    <div class="button">
	        <button type=submit>Submit</button>
	    </div>

	          </fieldset>
	        </form>
		<hr>
		<h4>Menu type="toolbar" with command elements type="radio" and type="command"</h4>
		<menu type="toolbar">
	 <command type="radio" radiogroup="alignment" checked="checked"
	          label="Left" icon="icons/alL.png" onclick="setAlign('left')">
	 <command type="radio" radiogroup="alignment"
	          label="Center" icon="icons/alC.png" onclick="setAlign('center')">
	 <command type="radio" radiogroup="alignment"
	          label="Right" icon="icons/alR.png" onclick="setAlign('right')">
	 <command type="command" disabled
	          label="Publish" icon="icons/pub.png" onclick="publish()">
	</menu>	

			<hr>
		<h4>Progress</h4>	
		<p>Progress: <progress id="p" max=100 value="50" tabindex="0"><span>50</span>%</progress></p>

		<hr>
		<h4>KeyGen</h4>
		<p><keygen name="key"></p>


		<hr>	
	        <h4>Inline text formatting:</h4>
	        <p>This is the <abbr title="Abbreviation">ABBR</abbr> element.</p>
	        <p>This is the <b>b</b> element.</p>
	        <p>This is the <cite>cite</cite> element.</p>
	        <p>This is the <code>code</code> element.</p>
	        <p>This is the <del>del</del> element.</p>
	        <p>This is the <dfn>dfn</dfn> element.</p>
	        <p>This is the <em>em</em> element.</p>
	        <p>This is the <i>i</i> element.</p>
	        <p>This is the <ins>ins</ins> element.</p>
	        <p>This is the <kbd>kbd</kbd> element.</p>
	        <p>This is the
	          <mark>mark</mark>
	          element.</p>
	        <p>This is the <samp>samp</samp> element.</p>
	        <p>This is the <small>small</small> element.</p>
	        <p>This is the <strong>strong</strong> element.</p>
	        <p>This is the <sub>sub</sub> element.</p>
	        <p>This is the <sup>sup</sup> element.</p>
	        <p>This is the <var>var</var> element.</p>
	        <hr>
	        <h4>Meter:</h4>
	        <p>An example of the <code>&lt;meter&gt;</code> element: Your score is:
	          <meter value="91" min="0" max="100" low="40" high="90" optimum="100" tabindex="0">A+</meter>
	        </p>
	        <hr>
	        <h4>Pre and span:</h4>
	        <p>This is the <code>&lt;pre&gt;</code> element:</p>
	        <pre>pre</pre>
	        <p>This is the <span>span</span> element. All <code>&lt;span&gt;</code> elements within this demo are set to <span>bold</span> for styling purposes only.</p>
	        <hr>
	        <h4>Table:</h4>
	        <table>
	          <thead>
	            <tr>
	              <th>Table header</th>
	              <th>Table header</th>
	              <th>Table header</th>
	            </tr>
	          </thead>
	          <tfoot>
	            <tr>
	              <td>Table footer</td>
	              <td>Table footer</td>
	              <td>Table footer</td>
	            </tr>
	          </tfoot>
	          <tbody>
	            <tr>
	              <td>Table data</td>
	              <td>Table data</td>
	              <td>Table data</td>
	            </tr>
	          </tbody>
	        </table>
	        <hr>
	        <h4>Time:</h4>
	        <p>The following is an example of the <code>&lt;time&gt;</code> element:</p>
	        <time datetime="2010-03-22T11:00-06:00">11AM in Texas on March 22, 2010</time>
	      </div>
		  <hr>
		  <h4>Hidden content (hidden attribute)</h4>
		  <p hidden>this should not be displayed. This <a href="#">link</a> should not be in the tab order</p>
	      <hr>
	      <footer class="article">
	        <p>This is the <code>&lt;footer&gt;</code> for this <code>&lt;article&gt;</code>.</p>
	        <h4><a id="info"></a>Details and summary:</h4>
	        <details>
	          <summary>Article Summary</summary>
	          <p>Details: some useful links to HTML5 and related specification documents. This uses the <code>&lt;details&gt;</code> and <code>&lt;summary&gt;</code> elements.</p>
	          <ul>
	            <li><a href="http://dev.w3.org/html5/spec/Overview.html">W3C HTML5 specification</a></li>
	            <li><a href="http://dev.w3.org/html5/markup/">HTML: the markup language reference</a></li>
	            <li><a href="http://dev.w3.org/html5/rdfa/">HTML + RDFa</a></li>
	            <li><a href="http://dev.w3.org/html5/md/">HTML Microdata</a></li>
	            <li><a href="http://dev.w3.org/html5/2dcontext/">HTML canvas 2d context</a></li>
	            <li><a href="http://www.w3.org/html/wg/html5/diff/">HTML5 differences from HTML 4</a></li>
	            <li><A href="http://dev.w3.org/html5/html-xhtml-author-guide/html-xhtml-authoring-guide.html">HTML/XHTML   Compatibility Authoring Guidelines</A></li>
	            <li><A href="http://dev.w3.org/html5/alt-techniques/">HTML5: Techniques for   providing useful text alternatives</A><BR>
	            </li>
	          </ul>
	        </details>
	      </footer>
	    </article>
	    <footer>
	      <p>This is the <code>&lt;footer&gt;</code> for this <code>&lt;section&gt; of this page/site</code>.</p>
	    </footer>
	  </section>
	  <aside>
	    <h3>The <code>&lt;aside&gt;</code> to the <code>&lt;section&gt;</code></h3>
	    <h4>Elements included in this demo:</h4>
	    <p><a id="toggle1" href="#" title="View / hide list of elements">View / hide</a> list of elements</p>
	    <p><span>Note:</span> Some elements are only used within the source code and not as examples.</p>
	    <ul id="list1">
	      <li><code>&lt;!-- Comments --&gt;</code></li>
	      <li><code>&lt;!DOCTYPE&gt;</code></li>
	      <li><code>&lt;a&gt;</code></li>
	      <li><code>&lt;abbr&gt;</code></li>
	      <li><code>&lt;address&gt;</code></li>
	      <li><code>&lt;article&gt;</code></li>
	      <li><code>&lt;aside&gt;</code></li>
	      <li><code>&lt;audio&gt;</code></li>
	      <li><code>&lt;b&gt;</code></li>
	      <li><code>&lt;blockquote&gt;</code></li>
	      <li><code>&lt;body&gt;</code></li>
	      <li><code>&lt;br&gt;</code></li>
	      <li><code>&lt;button&gt;</code></li>
	      <li><code>&lt;cite&gt;</code></li>
	      <li><code>&lt;code&gt;</code></li>
	      <li><code>&lt;del&gt;</code></li>
	      <li><code>&lt;details&gt;</code></li>
	      <li><code>&lt;dfn&gt;</code></li>
	      <li><code>&lt;div&gt;</code></li>
	      <li><code>&lt;em&gt;</code></li>
	      <li><code>&lt;fieldset&gt;</code></li>
	      <li><code>&lt;figcaption&gt;</code></li>
	      <li><code>&lt;figure&gt;</code></li>
	      <li><code>&lt;footer&gt;</code></li>
	      <li><code>&lt;form&gt;</code></li>
	      <li><code>&lt;h1&gt;</code> &ndash; <code>&lt;h6&gt;</code></li>
	      <li><code>&lt;head&gt;</code></li>
	      <li><code>&lt;header&gt;</code></li>
	      <li><code>&lt;hgroup&gt;</code></li>
	      <li><code>&lt;hr&gt;</code></li>
	      <li><code>&lt;html&gt;</code></li>
	      <li><code>&lt;i&gt;</code></li>
	      <li><code>&lt;img&gt;</code></li>
	      <li><code>&lt;input&gt;</code></li>
	      <li><code>&lt;ins&gt;</code></li>
	      <li><code>&lt;kbd&gt;</code></li>
	      <li><code>&lt;label&gt;</code></li>
	      <li><code>&lt;legend&gt;</code></li>
	      <li><code>&lt;li&gt;</code></li>
	      <li><code>&lt;link&gt;</code></li>
	      <li><code>&lt;mark&gt;</code></li>
	      <li><code>&lt;meta&gt;</code></li>
	      <li><code>&lt;meter&gt;</code></li>
	      <li><code>&lt;nav&gt;</code></li>
	      <li><code>&lt;noscript&gt;</code></li>
	      <li><code>&lt;ol&gt;</code></li>
	      <li><code>&lt;optgroup&gt;</code></li>
	      <li><code>&lt;option&gt;</code></li>
	      <li><code>&lt;p&gt;</code></li>
	      <li><code>&lt;pre&gt;</code></li>
	      <li><code>&lt;q&gt;</code></li>
	      <li><code>&lt;samp&gt;</code></li>
	      <li><code>&lt;script&gt;</code></li>
	      <li><code>&lt;section&gt;</code></li>
	      <li><code>&lt;select&gt;</code></li>
	      <li><code>&lt;small&gt;</code></li>
	      <li><code>&lt;source&gt;</code></li>
	      <li><code>&lt;span&gt;</code></li>
	      <li><code>&lt;strong&gt;</code></li>
	      <li><code>&lt;style&gt;</code></li>
	      <li><code>&lt;sub&gt;</code></li>
	      <li><code>&lt;summary&gt;</code></li>
	      <li><code>&lt;sup&gt;</code></li>
	      <li><code>&lt;table&gt;</code></li>
	      <li><code>&lt;tbody&gt;</code></li>
	      <li><code>&lt;td&gt;</code></li>
	      <li><code>&lt;textarea&gt;</code></li>
	      <li><code>&lt;tfoot&gt;</code></li>
	      <li><code>&lt;th&gt;</code></li>
	      <li><code>&lt;thead&gt;</code></li>
	      <li><code>&lt;time&gt;</code></li>
	      <li><code>&lt;title&gt;</code></li>
	      <li><code>&lt;tr&gt;</code></li>
	      <li><code>&lt;ul&gt;</code></li>
	      <li><code>&lt;var&gt;</code></li>
	      <li><code>&lt;video&gt;</code></li>
	    </ul>
	    <h4>Elements not included in this demo:</h4>
	    <p><a id="toggle2" href="#" title="View / hide list of elements">View / hide</a> list of elements</p>
	    <ul id="list2">
	      <li><code>&lt;area&gt;</code></li>
	      <li><code>&lt;base&gt;</code></li>
	      <li><code>&lt;bdo&gt;</code></li>
	      <li><code>&lt;canvas&gt;</code></li>
	      <li><code>&lt;caption&gt;</code></li>
	      <li><code>&lt;col&gt;</code></li>
	      <li><code>&lt;colgroup&gt;</code></li>
	      <li><code>&lt;dd&gt;</code></li>
	      <li><code>&lt;dl&gt;</code></li>
	      <li><code>&lt;dt&gt;</code></li>
	      <li><code>&lt;embed&gt;</code></li>
	      <li><code>&lt;iframe&gt;</code></li>
	      <li><code>&lt;map&gt;</code></li>
	      <li><code>&lt;object&gt;</code></li>
	      <li><code>&lt;param&gt;</code></li>
	      <li><code>&lt;rp&gt;</code></li>
	      <li><code>&lt;rt&gt;</code></li>
	      <li><code>&lt;ruby&gt;</code></li>
	    </ul>
	    <h4>Elements not supported by HTML5:</h4>
	    <p><a id="toggle3" href="#" title="View / hide list of elements">View / hide</a> list of elements</p>
	    <ul id="list3">
	      <li><code>&lt;acronym&gt;</code></li>
	      <li><code>&lt;applet&gt;</code></li>
	      <li><code>&lt;basefont&gt;</code></li>
	      <li><code>&lt;big&gt;</code></li>
	      <li><code>&lt;center&gt;</code></li>
	      <li><code>&lt;dir&gt;</code></li>
	      <li><code>&lt;font&gt;</code></li>
	      <li><code>&lt;frame&gt;</code></li>
	      <li><code>&lt;frameset&gt;</code></li>
	      <li><code>&lt;noframes&gt;</code></li>
	      <li><code>&lt;s&gt;</code></li>
	      <li><code>&lt;strike&gt;</code></li>
	      <li><code>&lt;tt&gt;</code></li>
	      <li><code>&lt;u&gt;</code></li>
	      <li><code>&lt;xmp&gt;</code></li>
	    </ul>
	  </aside>
	  <footer>
	    <p>This is the global <code>&lt;footer&gt;</code> for this page/site.</p>
	    <nav>
	      <ul>
	        <li><a href="#" title="Global footer link">Global footer <code>&lt;nav&gt;</code> link</a></li>
	        <li><a href="#" title="Global footer link">Global footer <code>&lt;nav&gt;</code> link</a></li>
	        <li><a href="#" title="Global footer link">Global footer <code>&lt;nav&gt;</code> link</a></li>
	      </ul>
	    </nav>
	    <p>This document is a modified version of the document prepared by <a href="http://www.ackernaut.com/" title="the Ackernaut">the Ackernaut</a> for the benefit of the web development community. <br>
	      If you have suggestions on how to improve this page let him know: terry / at / ackernaut / dot / com<br>
	      Feel free to borrow and share a link! <br></p>
	  </footer>
	</div>


</body>
</html>