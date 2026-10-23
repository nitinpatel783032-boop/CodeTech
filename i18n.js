// ===== Code Master: i18n.js (v2: default Hinglish + proper English) =====
(function () {
  "use strict";
  var STORAGE_KEY = "cm_ai_language";
  var DEFAULT_LANG = "hinglish";

  var LANGS = [
    { value: "hinglish", label: "Hinglish (Default)" },
    { value: "en", label: "English" }
  ];
  var HTML_LANG = { hinglish: "hi-Latn", en: "en" };

  // ------------------------------------------------------------------
  // TRANSLATIONS: [ "Hinglish text ki shuruaat (chhote akshar)", "English" ]
  //  - Key text ke shuru se match hota hai.
  //  - Key ke end mein "=" ho to poora text exact match hona chahiye.
  //  - English mein HTML tags ho sakte hain (paragraphs ke liye).
  // ------------------------------------------------------------------
  var ENTRIES = [
    // ===== Onboarding (index.html) =====
    [`pehle ek chota sa parichay`, `First, a quick introduction! (Optional)`],
    [`apna naam batao`, `Tell us your name for a personalized experience`],
    [`aapka naam likhein`, `Enter your name`],
    [`ya=`, `or`],
    [`aage badho`, `Continue`],
    [`skip karo, seedha shuru karo`, `Skip and get started`],
    [`sawaal 1 / 2=`, `Question 1 / 2`],
    [`sawaal 2 / 2=`, `Question 2 / 2`],
    [`web development kyu sikhna chahte hain`, `Why do you want to learn web development`],
    [`ek ya zyada options choose karo`, `Choose one or more options`],
    [`naukri / career ke liye`, `For a job / career`],
    [`student hoon, seekhna hai`, `I'm a student and I want to learn`],
    [`hobby / interest ke liye`, `As a hobby / out of interest`],
    [`freelancing karni hai`, `I want to start freelancing`],
    [`apna project / startup`, `My own project / startup`],
    [`bas explore kar raha hoon`, `Just exploring`],
    [`wapas=`, `Back`],
    [`aage=`, `Next`],
    [`kya aapke paas pc ya laptop available hai`, `Do you have a PC or laptop available`],
    [`isse hum aapko sahi guidance de sakte hain`, `This helps us guide you better`],
    [`haan, pc hai`, `Yes, I have a PC`],
    [`haan, laptop hai`, `Yes, I have a laptop`],
    [`dono hain`, `I have both`],
    [`abhi sirf mobile hai`, `I only have a mobile for now`],
    [`shuru karo=`, `Get Started`],
    [`aapka coding journey ab shuru hota hai`, `Your coding journey starts now`],
    [`ready ho rahe hain`, `Getting ready`],
    [`chalte hain=`, `Let's Go`],

    // ===== Shared (nav, buttons, footer) =====
    [`hd videos=`, `HD Videos`],
    [`hd videos dekho=`, `Watch HD Videos`],
    [`hd learning=`, `HD Learning`],
    [`theme badlo`, `Change theme`],
    [`sare videos dekho=`, `Watch All Videos`],
    [`html seekho=`, `Learn HTML`],
    [`css seekho=`, `Learn CSS`],
    [`js seekho=`, `Learn JS`],
    [`javascript seekho=`, `Learn JavaScript`],
    [`play karo=`, `Play Now`],
    [`india ka #1 hindi coding tutorial website. noob se pro tak`, `India's #1 Hindi coding tutorial website. Your journey from beginner to pro starts here`],
    [`india ka #1 hindi coding tutorial website`, `India's #1 Hindi coding tutorial website`],

    // ===== index.html: hero =====
    [`noob se pro tak=`, `From Beginner to Pro`],
    [`web development seekho aasaan tarike se`, `Learn Web Development<br/><span class="gradient-text">the Easy Way</span>`],
    [`html, css, aur javascript`, `Learn HTML, CSS and JavaScript from the very basics to advanced topics, with interactive examples, HD videos and hands-on coding`],

    // ===== index.html: tracks =====
    [`apna track chuno`, `Choose Your Track`],
    [`teen powerful languages seekho`, `Learn three powerful languages — together or one at a time`],
    [`web pages ka dhaacha`, `The skeleton of every web page. Learn tags, elements, forms and tables — everything from the basics`],
    [`kya hota hai html`, `What is HTML`],
    [`tags aur elements`, `Tags and Elements`],
    [`websites ko sundar banao`, `Make websites beautiful. Colors, layouts, animations — all with CSS`],
    [`pages ko interactive banao`, `Make pages interactive. Logic, the DOM, events and APIs — all with JS`],

    // ===== index.html: video promo =====
    [`hd videos se seekho`, `Learn with HD Videos`],
    [`sirf text nahi`, `Don't just read — watch and understand! HD videos make concepts crystal clear. Every topic has a visual video`],
    [`html structure hd tour=`, `HTML Structure HD Tour`],
    [`flexbox hd demo=`, `Flexbox HD Demo`],
    [`is video mai jo topics`, `Some topics in this video are a bit complex,`],
    [`use aage website par`, `and they are covered in more detail later on the website.`],
    [`dekhne ke liye=`, `To watch them, click the`],
    [`button par click karo=`, `button`],
    [`html ka pora course`, `The complete HTML course. [To play the video, click the`],
    [`or is video mai cut ka button`, `This video has no close button, so clicking anywhere else on the website will close it`],

    // ===== index.html: live code =====
    [`live code try karo`, `Try Live Code`],
    [`jis bhi file ka code run karna ho`, `Click the name of the file whose code you want to run first`],
    [`seedha yahan code likho aur result dekho`, `Write code right here and see the result`],
    [`note; is file mai css and js`, `{<u>Note</u>: In this file you can change the CSS and JS yourself — it is manual.}`],

    // ===== index.html: video modal =====
    [`html, css aur javascript — ek hi video`, `HTML, CSS and JavaScript — a complete web development course in a single video. Learn step by step with Code With Harry`],
    [`youtube par dekho`, `Watch on YouTube`],

    // ===== videos.html =====
    [`hd videos se seekho concepts ko visually`, `Learn with HD Videos<br/><span class="gradient-text">Understand Concepts Visually</span>`],
    [`har video ek concept ko hd animation`, `Every video explains a concept with HD animation — completely free`],
    [`sab=`, `All`],
    [`html dom tree — hd tour`, `HTML DOM Tree — HD Tour`],
    [`dom structure ko hd videos se samjho`, `Understand the DOM structure with HD videos`],
    [`box model — hd explode view`, `Box Model — HD Exploded View`],
    [`margin, border, padding, content ko hd mein dekho`, `See Margin, Border, Padding and Content in HD`],
    [`loops — hd visual`, `Loops — HD Visual`],
    [`for, while, foreach loops ka visual walkthrough`, `A visual walkthrough of for, while and forEach loops`],
    [`justify-content, align-items ko animation mein dekho`, `See justify-content and align-items in animation`],
    [`css grid — hd layout builder`, `CSS Grid — HD Layout Builder`],
    [`grid areas ko hd space mein arrange karo`, `Arrange grid areas in HD space`],
    [`click, hover, submit events ka visual explanation`, `A visual explanation of Click, Hover and Submit events`],
    [`promise chain aur async execution ko visualize karo`, `Visualize promise chains and async execution`],
    [`mobile to desktop layout shift ka hd demo`, `An HD demo of the layout shift from mobile to desktop`],
    [`input types, validation, aur submission ka walkthrough`, `A walkthrough of input types, validation and submission`],

    // ===== code-master-ai.html =====
    [`bolke ya likh ke pucho`, `Ask by speaking or typing, send a screenshot, or listen to the answers in voice — your coding buddy is always ready`],

        // ===== settings.html =====
    [`apni language, profile aur seekhne ki jaankari`, `Change your language, profile and learning details here`],
    [`bhasha (language)`, `Language`],
    [`poori website aur code master ai isi bhasha mein chalenge`, `The whole website and Code Master AI will use this language`],
    [`mera profile=`, `My Profile`],
    [`naam=`, `Name`],
    [`save karo=`, `Save`],
    [`meri seekhne ki jaankari=`, `My Learning Details`],
    [`night mode mein aankhon par kam zor padta hai`, `Night mode is easier on your eyes`],
    [`shuruaati sawaal=`, `Welcome Questions`],
    [`naam aur seekhne ke sawaal dobara bharna ho to`, `Press this if you want to fill in your name and learning questions again`],
    [`onboarding dobara shuru karo=`, `Restart Onboarding`],
    [`mera data=`, `My Data`],
    [`ye sara data sirf is browser mein save hota hai`, `All of this data is saved only in this browser. You can download or delete it. After deleting, the welcome questions will appear again`],
    [`download my data=`, `Download My Data`],
    [`sara data hatao=`, `Clear All Data`],

    // ===== JS se aane wala text: welcome message (script.js) =====
    [`seedha action mein aaye ho — respect`, `You jumped straight into action — respect`],
    [`freelancing se apni zindagi control karo — sahi raah hai`, `Take control of your life with freelancing — you're on the right path`],
    [`apna startup banana hai? coding tumhari superpower hai`, `Want to build your own startup? Coding is your superpower`],
    [`career mein coding ek game-changer hai — bilkul sahi decision`, `Coding is a game-changer for a career — absolutely the right decision`],
    [`students ke liye coding`, `Coding is one of the best skills a student can have. Keep the fire burning`],

    // ===== JS se aane wala text: video modal (video.js) =====
    [`document object model (dom) ek tree structure hai`, `The Document Object Model (DOM) is a tree structure in which all HTML elements are nodes. JavaScript can read and modify these nodes.`],
    [`har html element ek rectangular box hai`, `Every HTML element is a rectangular box made up of Content, Padding, Border and Margin. The Box Model is the most important concept in CSS layout.`],
    [`loops se repetitive tasks efficiently karte hain`, `Loops let you perform repetitive tasks efficiently. A for loop runs with a counter, a while loop checks a condition, and forEach works on arrays.`],
    [`flexbox ek 1d layout system hai`, `Flexbox is a 1D layout system that arranges items in a row or a column. Positioning is controlled with justify-content and align-items.`],
    [`css grid ek 2d layout system hai`, `CSS Grid is a 2D layout system that places items in both rows and columns. Grid is perfect for complex page layouts.`],
    [`events user actions ke responses hain`, `Events are responses to user actions — click, hover, keypress, submit. With addEventListener, JavaScript can "listen" for these events.`],
    [`javascript single-threaded hai but asynchronous code`, `JavaScript is single-threaded, but asynchronous code allows non-blocking operations. Promises and async/await handle API calls and file reads.`],
    [`media queries se css different screen sizes`, `With Media Queries, CSS defines different rules for different screen sizes. In the mobile-first approach, you design for mobile first and then expand to desktop.`],
    [`html forms user se data collect karte hain`, `HTML Forms collect data from the user. Input types (text, email, password, number, checkbox), validation attributes and form submission are all covered here.`],
    [`video jald aayegi`, `Video coming soon`],
    [`abhi koi youtube video link nahi hai`, `There is no YouTube video link yet`],

    // ===== html-tutorial.html =====
    [`html kya hai=`, `What is HTML`],
    [`html (hypertext markup language) — web ka bunyaad`, `HTML (HyperText Markup Language) — the foundation of the web. Go from zero to HTML pro`],
    [`1. html kya hota hai`, `1. What is HTML`],
    [`html ek markup language hai jo web pages ka structure`, `HTML is a <strong>markup language</strong> that defines the <em>structure</em> of web pages. The browser reads HTML and displays it on the screen.`],
    [`html ≠ programming language. isme loops`, `<strong>HTML ≠ a programming language.</strong> It has no loops or conditions — only the structure of content. For logic, there is JavaScript!`],
    [`html ka simple example`, `A simple HTML example`],
    [`html ke liye sirf 2 cheezein chahiye`, `You only need <strong>2 things</strong> for HTML:`],
    [`best setup:`, `<strong>Best Setup:</strong><br>✅ <strong>VS Code</strong> — code.visualstudio.com (free)<br>✅ <strong>Google Chrome</strong> — with DevTools<br>✅ VS Code Extension: <strong>Live Server</strong> — save the file and the browser refreshes automatically`],
    [`pehla file banao`, `Create your first file — 5 steps`],
    [`har html file ka ek standard template hota hai`, `Every HTML file has a <strong>standard template</strong> — always use this:`],
    [`khud try karo=`, `Try It Yourself`],
    [`html tags angle brackets mein hote hain`, `HTML <strong>tags</strong> are written inside angle brackets. An <strong>element</strong> = opening tag + content + closing tag.`],
    [`html — saare important tags`, `html — All Important Tags`],
    [`attributes tags ko extra information dete hain`, `Attributes give extra information to tags — always inside the <strong>opening tag</strong> in <code>name="value"</code> format.`],
    [`html — saare common attributes`, `html — All Common Attributes`],
    [`6. headings — h1 se h6`, `6. Headings — h1 to h6`],
    [`html mein 6 levels ki headings hain`, `HTML has 6 levels of headings. <strong>h1 = the main title of the page</strong> (only one per page!), h6 = the smallest.`],
    [`seo rule: ek page mein sirf`, `<strong>SEO Rule:</strong> A page should have only <strong>one &lt;h1&gt;</strong>. Google gives this heading the most importance!`],
    [`headings try karo=`, `Try Headings`],
    [`<p> tag paragraph banata hai`, `The <code>&lt;p&gt;</code> tag creates a paragraph. The browser automatically adds space above and below it.`],
    [`text formatting try karo=`, `Try Text Formatting`],
    [`anchor tag se hyperlinks banate hain`, `The anchor tag creates hyperlinks. <code>href</code> = destination.`],
    [`html — sab types ke links`, `html — All Types of Links`],
    [`<img> self-closing tag hai`, `<code>&lt;img&gt;</code> is a self-closing tag. <code>src</code> = path, <code>alt</code> = description (essential for accessibility!).`],
    [`images try karo=`, `Try Images`],
    [`10. id & class — pehchaan ka fark`, `10. Id & Class — Knowing the Difference`],
    [`id aur class dono attributes hain`, `<code>id</code> and <code>class</code> are both <strong>attributes</strong> used to target HTML elements from CSS/JS — but their <em>rules are different</em>.`],
    [`ek line mein yaad rakho:`, `<strong>Remember in one line:</strong><br><code>id</code> = <strong>unique name</strong> (only one element per page) &nbsp;|&nbsp; <code>class</code> = <strong>group name</strong> (many elements can share it)`],
    [`id vs class — fark ek nazar mein`, `Id vs Class — Difference at a Glance`],
    [`common galti:`, `<strong>Common Mistake:</strong> Don't use the same <code>id</code> twice on a page!<br><code>&lt;div id="box"&gt;</code> and <code>&lt;div id="box"&gt;</code> — this is <strong>WRONG</strong>!<br>JavaScript will only pick the first one. Use <code>class</code> for this kind of work.`],
    [`id & class live try karo=`, `Try Id & Class Live`],
    [`bonus tip — id se page scroll`, `<strong>Bonus Tip — scroll the page with an id!</strong><br>You can use an <code>id</code> like a URL anchor:<br><code>&lt;a href="<strong>#id-class</strong>"&gt;Go to this section&lt;/a&gt;</code><br>This tutorial's sidebar works with the same trick! 👆`],
    [`lists try karo=`, `Try Lists`],
    [`teen types:`, `Three types: <strong>Unordered</strong> (bullets), <strong>Ordered</strong> (numbers), <strong>Description</strong> (term + definition).`],
    [`tables se data rows aur columns mein organize karte hain`, `Use tables to organize data into rows and columns.`],
    [`table try karo=`, `Try a Table`],
    [`forms se user se data lete hain`, `Forms collect data from the user. Login, contact, search — all of them use forms`],
    [`complete form try karo=`, `Try a Complete Form`],
    [`<div> = block container`, `<code>&lt;div&gt;</code> = <strong>block container</strong> (takes the full line, for layout). <code>&lt;span&gt;</code> = <strong>inline container</strong> (inside text).`],
    [`div vs span try karo=`, `Try Div vs Span`],
    [`semantic tags content ka meaning batate hain`, `Semantic tags describe the <em>meaning</em> of content. Use meaningful tags instead of <code>&lt;div&gt;</code> — both SEO and accessibility improve!`],
    [`meta tags <head> mein hote hain`, `Meta tags live inside <code>&lt;head&gt;</code> — information for browsers and search engines. Users don't see them!`],
    [`html5 mein native audio/video support hai`, `HTML5 has native audio/video support — no Flash needed`],
    [`canvas ek html element hai`, `Canvas is an HTML element on which JavaScript draws shapes, images and animations. Games and charts are all made with canvas`],
    [`canvas drawing try karo=`, `Try Canvas Drawing`],

    // ===== css-tutorial.html =====
    [`css kya hai=`, `What is CSS`],
    [`css (cascading style sheets) se websites ko sundar`, `CSS (Cascading Style Sheets) makes websites beautiful and attractive — colors, layouts and animations all come from CSS`],
    [`css kya hota hai=`, `What is CSS`],
    [`html structure banata hai, css usse style deta hai`, `HTML creates the structure, <strong>CSS gives it style</strong>. Without CSS a website looks like plain text — CSS is what makes it beautiful.`],
    [`css — pehla css code`, `css — Your First CSS Code`],
    [`css 3 tarike se lagaya ja sakta hai`, `CSS can be applied in 3 ways: <strong>Inline</strong> (style attribute), <strong>Internal</strong> (&lt;style&gt; tag), <strong>External</strong> (.css file). External is the best practice!`],
    [`selectors — elements ko target karo`, `Selectors — Target Elements`],
    [`selector batata hai ki css kaunse element pe lagegi`, `A selector tells CSS which element it applies to. There are three main types`],
    [`specificity rule:`, `<strong>Specificity Rule:</strong> ID &gt; Class &gt; Element. If there is a conflict, the more specific selector wins!`],
    [`css mein color alag-alag tarike se diya ja sakta hai`, `In CSS, color can be specified in different ways. Backgrounds can be anything from a solid color to a gradient`],
    [`colors & gradients try karo=`, `Try Colors & Gradients`],
    [`css se text ki har cheez customize kar sakte ho`, `With CSS you can customize every part of text — font, size, weight, spacing, decoration and more`],
    [`typography try karo=`, `Try Typography`],
    [`box model — css ka dil`, `Box Model — The Heart of CSS`],
    [`har html element ek box hai`, `Every HTML element is a <strong>box</strong>. The box model has 4 parts: Content, Padding, Border, Margin.`],
    [`box model dekho=`, `See the Box Model`],
    [`display property control karti hai`, `The <code>display</code> property controls how an element is displayed. <code>position</code> tells where the element will be on the page.`],
    [`position demo try karo=`, `Try the Position Demo`],
    [`flexbox — layout ka jaadu`, `Flexbox — The Magic of Layout`],
    [`flexbox se items ko row ya column mein easily arrange kar sakte ho`, `With Flexbox you can easily arrange items in a row or a column. A must-know for modern layouts`],
    [`flexbox try karo=`, `Try Flexbox`],
    [`css grid se rows aur columns dono mein layout banate hain`, `CSS Grid builds layouts in both rows and columns. Flexbox works in one direction, Grid works in both`],
    [`css grid try karo=`, `Try CSS Grid`],
    [`pseudo-classes kisi element ki special state`, `Pseudo-classes target a special <em>state</em> of an element (hover, focus, etc.). Pseudo-elements style a <em>part</em> of an element.`],
    [`pseudo-classes try karo=`, `Try Pseudo-classes`],
    [`@keyframes se custom animations banate hain`, `Create custom animations with <code>@keyframes</code>. Apply them to an element with the <code>animation</code> property.`],
    [`animation try karo=`, `Try Animation`],
    [`css variables se ek jagah color ya value define karo`, `Define a color or value in one place with CSS Variables and use it across the whole site. Perfect for theming`],
    [`pro tip: css variables se dark/light mode`, `<strong>Pro Tip:</strong> You can build dark/light mode with CSS Variables in just a few lines. Change the theme from JavaScript with <code>document.documentElement.style.setProperty('--bg', '#fff')</code>!`],
    [`responsive design — har screen pe acha dikho`, `Responsive Design — Look Good on Every Screen`],
    [`responsive design matlab website mobile`, `Responsive design means a website looks good on mobile, tablet and desktop. We use <strong>Media Queries</strong> for this.`],
    [`responsive grid try karo=`, `Try a Responsive Grid`],
    [`best practice: html head mein`, `<strong>Best Practice:</strong> Always add <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> in the HTML head. Without it, responsive design won't work on mobile!`],

    // ===== js-tutorial.html =====
    [`js kya hai=`, `What is JS`],
    [`javascript se web pages interactive bante hain`, `JavaScript makes web pages interactive — buttons, animations and forms all come to life with JS`],
    [`javascript kya hota hai=`, `What is JavaScript`],
    [`html structure deta hai, css design deta hai`, `HTML provides structure, CSS provides design, and <strong>JavaScript provides behavior</strong>. Something happens on click, a form gets validated, data gets fetched — JS does it all.`],
    [`js browser mein directly run hoti hai`, `JS runs directly in the browser — no server needed. See the output of <code>console.log()</code> in the browser's DevTools (F12).`],
    [`variables — data store karo`, `Variables — Store Data`],
    [`variables mein data store karte hain`, `Variables store data. JS has three keywords: <code>var</code>, <code>let</code> and <code>const</code>.`],
    [`note: aaj ke time mein var`, `<strong>Note:</strong> Avoid using <code>var</code> these days. Always use <code>let</code> or <code>const</code> — they are more predictable.`],
    [`data types — kitne tarah ka data`, `Data Types — What Kinds of Data Exist`],
    [`javascript mein 8 data types hain`, `JavaScript has 8 data types — <strong>7 Primitive</strong> and <strong>1 Object</strong>. Use the <code>typeof</code> operator to find a type.`],
    [`data types try karo=`, `Try Data Types`],
    [`operators — operations karo`, `Operators — Perform Operations`],
    [`operators se calculations, comparisons aur logic karte hain`, `Operators are used for calculations, comparisons and logic`],
    [`if/else — decisions lena`, `If/Else — Making Decisions`],
    [`condition check karke alag-alag code run karte hain`, `Run different code by checking a condition`],
    [`if/else try karo=`, `Try If/Else`],
    [`loops — baar baar karo`, `Loops — Repeat Again and Again`],
    [`loops se ek kaam baar baar karte hain`, `Loops repeat a task many times without repeating the code`],
    [`functions ek kaam ko baar baar karne ka tarika hai`, `Functions are a way to do a task again and again — write once, use a thousand times`],
    [`functions try karo=`, `Try Functions`],
    [`arrays — data ki list`, `Arrays — A List of Data`],
    [`array ordered list hoti hai`, `An array is an ordered list. Values go inside square brackets <code>[]</code>. The index starts at 0.`],
    [`arrays try karo=`, `Try Arrays`],
    [`object mein related data ek jagah store karte hain`, `An object stores related data in one place — as key-value pairs. In JS almost everything is an object`],
    [`objects try karo=`, `Try Objects`],
    [`dom manipulation — html badlo js se`, `DOM Manipulation — Change HTML with JS`],
    [`dom (document object model) se js html elements ko read`, `With the DOM (Document Object Model), JS can read, change, add and remove HTML elements`],
    [`dom try karo=`, `Try the DOM`],
    [`events — user actions handle karo`, `Events — Handle User Actions`],
    [`events tab fire hote hain jab user kuch karta hai`, `Events fire when the user does something — click, keypress, scroll, form submit, etc. We handle them with <code>addEventListener</code>.`],
    [`events try karo=`, `Try Events`],
    [`es6 (2015) ke baad js mein bahut saari cool features aayi hain`, `Many cool features have arrived in JS since ES6 (2015). Be sure to learn them`],
    [`javascript single-threaded hai lekin async code se`, `JavaScript is single-threaded, but async code lets it handle network requests, timers and more in a non-blocking way`],
    [`pro tip: hamesha try/catch`, `<strong>Pro Tip:</strong> Always use <code>try/catch</code> with async functions — otherwise network errors can fail silently!`],
    [`fetch() se real apis se live data`, `With <code>fetch()</code> you can get live data from real APIs. JSONPlaceholder is a free practice API.`],
    [`fetch api try karo! (live data`, `Try the Fetch API! (Live Data`],
    [`practice apis:`, `<strong>Practice APIs:</strong> JSONPlaceholder (<code>jsonplaceholder.typicode.com</code>) — a free fake REST API. OpenWeatherMap, CoinGecko and NewsAPI are perfect for beginners who want real data!`]
  ];

     // ---------- helpers ----------
  function norm(s) { return s.replace(/\s+/g, " ").trim().toLowerCase(); }
  function stripLead(s) { return s.replace(/^[^\p{L}\p{N}]+/u, ""); }
  function stripTrail(s) { return s.replace(/[^\p{L}\p{N}]+$/u, ""); }
  function valid(v) { return Object.prototype.hasOwnProperty.call(HTML_LANG, v); }

  function getLang() {
    var v = localStorage.getItem(STORAGE_KEY);
    return valid(v) ? v : DEFAULT_LANG;
  }

  var KEYS = [];
  var PAIRS = [];
  var inited = false;

  // entry = [ "hinglish text ki shuruaat", "English", "w" ]
  //   key ke end mein "=" ho to poora text match hona chahiye
  //   "w" ho to poora text node badal do
  // Same key dobara aaye to naya wala purane ko override karta hai
  function addEntries(list) {
    list.forEach(function (e) {
      var k = e[0], exact = false;
      if (k.charAt(k.length - 1) === "=") { exact = true; k = k.slice(0, -1); }
      k = stripTrail(stripLead(norm(k)));
      if (!k) return;
      for (var i = KEYS.length - 1; i >= 0; i--) {
        if (KEYS[i].k === k && KEYS[i].exact === exact) KEYS.splice(i, 1);
      }
      KEYS.push({
        k: k, exact: exact, v: e[1],
        whole: (e[2] || "").indexOf("w") !== -1,
        spaced: k.indexOf(" ") !== -1
      });
    });
    KEYS.sort(function (a, b) { return b.k.length - a.k.length; }); // lambi key pehle
  }

  // pair = [ "demo / editor code ke andar ka Hinglish text", "English" ]
  function addPairs(list) {
    list.forEach(function (p) { if (p && p[0]) PAIRS.push(p); });
    PAIRS.sort(function (a, b) { return b[0].length - a[0].length; });
  }

  addEntries(ENTRIES);

  // inCode = pre/code ke andar | isComment = comment span ke andar
  // Code ke andar sirf comments ya spaces wali keys translate hoti hain
  function lookup(text, inCode, isComment) {
    var t = stripLead(norm(text));
    if (!t) return null;
    var tt = stripTrail(t);
    for (var i = 0; i < KEYS.length; i++) {
      var K = KEYS[i];
      if (inCode && !isComment && !K.spaced) continue;
      if (K.exact ? tt === K.k : t.indexOf(K.k) === 0) return K;
    }
    return null;
  }

  function applyPairs(str) {
    var out = str;
    for (var j = 0; j < PAIRS.length; j++) {
      if (out.indexOf(PAIRS[j][0]) !== -1) out = out.split(PAIRS[j][0]).join(PAIRS[j][1]);
    }
    return out;
  }

  // script.js jaisi JS files isse apna text translate karwati hain
  function tr(str) {
    return getLang() === DEFAULT_LANG ? str : applyPairs(str);
  }

  // ---------- translation engine ----------
  var SKIP = "script,style,noscript,pre,code,textarea,[translate='no'],.notranslate,.code-body,.floating-code";
  var SKIP_TEXT = "script,style,noscript,textarea,[translate='no'],.notranslate,.code-body,.floating-code";
  var INLINE = { A: 1, STRONG: 1, EM: 1, B: 1, U: 1, CODE: 1, SPAN: 1, SMALL: 1, MARK: 1, SUB: 1, SUP: 1, BR: 1, KBD: 1 };
  var ICONS = "i,img,svg,input,button,select,textarea,canvas,iframe";
  var EDGE = /^([^\p{L}\p{N}]*)([\s\S]*?)([^\p{L}\p{N}]*)$/u;
  var ATTRS = ["placeholder", "title", "aria-label"];

  var records = [];
  var recMap = new WeakMap();

  function remember(rec) {
    records.push(rec);
    if (rec.kind !== "attr") recMap.set(rec.ref, rec);
  }

  function isInlineContainer(el) {
    var kids = el.children;
    if (!kids.length) return false;
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i];
      if (!INLINE[c.tagName]) return false;
      if (c.querySelector(ICONS)) return false;
    }
    return true;
  }

  // Pass A: tags wale paragraphs (strong, code, em...) poore translate
  function translateBlocks(root) {
    var els = root.querySelectorAll("*");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.isConnected || recMap.has(el) || el.closest(SKIP) || !isInlineContainer(el)) continue;
      var K = lookup(el.textContent, false, false);
      if (!K) continue;
      var rec = { kind: "html", ref: el, orig: el.innerHTML };
      el.innerHTML = K.v;
      rec.shown = el.innerHTML;
      remember(rec);
    }
  }

  // Pass B: simple text nodes (code blocks ke comments bhi)
  function translateTexts(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var p = node.parentElement;
      if (!p || !node.isConnected || p.closest(SKIP_TEXT)) return;
      var rec = recMap.get(node);
      if (rec && node.nodeValue === rec.shown) return;
      if (!node.nodeValue.trim()) return;
      var m = node.nodeValue.match(EDGE);
      if (!m || !m[2]) return;
      var K = lookup(m[2], !!p.closest("pre,code"), !!p.closest(".cmt"));
      if (!K) return;
      if (!K.whole && /<[a-z\/]/i.test(K.v)) return;
      var out = K.whole ? K.v : m[1] + K.v + m[3];
      remember({ kind: "text", ref: node, orig: node.nodeValue, shown: out });
      node.nodeValue = out;
    });
  }

  // Pass C: placeholder / title / aria-label
  function translateAttrs(root) {
    var els = root.querySelectorAll("[placeholder],[title],[aria-label]");
    for (var i = 0; i < els.length; i++) {
      (function (el) {
        ATTRS.forEach(function (a) {
          if (!el.hasAttribute(a) || el.hasAttribute("data-cm-o-" + a)) return;
          var v = el.getAttribute(a);
          var m = v.match(EDGE);
          if (!m || !m[2]) return;
          var K = lookup(m[2], false, false);
          if (!K || /<[a-z\/]/i.test(K.v)) return;
          var out = m[1] + K.v + m[3];
          el.setAttribute("data-cm-o-" + a, v);
          el.setAttribute(a, out);
          remember({ kind: "attr", ref: el, attr: a, orig: v, shown: out });
        });
      })(els[i]);
    }
  }

  // Pass D: "Try karo" demos (textarea ka code) + iframe dobara chalao
  function rerun(ta) {
    var box = ta.closest(".try-it-box");
    var frame = box && box.querySelector("iframe");
    if (!frame) return;
    try {
      var d = frame.contentDocument || frame.contentWindow.document;
      d.open(); d.write(ta.value); d.close();
    } catch (e) {}
  }

  function translateDemos(root) {
    if (!PAIRS.length) return;
    var tas = root.querySelectorAll(".try-it-box textarea");
    for (var i = 0; i < tas.length; i++) {
      var ta = tas[i];
      if (recMap.has(ta)) continue;
      var orig = ta.value, out = applyPairs(orig);
      if (out === orig) continue;
      ta.value = out;
      remember({ kind: "demo", ref: ta, orig: orig, shown: out });
      rerun(ta);
    }
  }

  function translateAll(root) {
    translateBlocks(root);
    translateTexts(root);
    translateAttrs(root);
    translateDemos(root);
  }

  function restoreAll() {
    for (var i = records.length - 1; i >= 0; i--) {
      var r = records[i];
      if (r.kind === "text") {
        if (r.ref.nodeValue === r.shown) r.ref.nodeValue = r.orig;
      } else if (r.kind === "html") {
        if (r.ref.innerHTML === r.shown) r.ref.innerHTML = r.orig;
      } else if (r.kind === "demo") {
        if (r.ref.value === r.shown) { r.ref.value = r.orig; rerun(r.ref); }
      } else if (r.kind === "attr") {
        if (r.ref.getAttribute(r.attr) === r.shown) r.ref.setAttribute(r.attr, r.orig);
        r.ref.removeAttribute("data-cm-o-" + r.attr);
      }
      if (r.kind !== "attr") recMap.delete(r.ref);
    }
    records = [];
  }

  // ---------- observer (naya content aaye to translate) ----------
  var observer = null;
  var timer = null;
  function pause() { if (observer) observer.disconnect(); }
  function resume() {
    if (observer && document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  function refresh() {
    if (!document.body) return;
    pause();
    var lang = getLang();
    restoreAll();
    document.documentElement.setAttribute("lang", HTML_LANG[lang]);
    if (lang !== DEFAULT_LANG) translateAll(document.body);
    resume();
  }

  function scan() {
    if (getLang() === DEFAULT_LANG) return;
    pause();
    translateAll(document.body);
    resume();
  }

  function setLang(v) {
    if (!valid(v)) v = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, v);
    refresh();
    // home page ka live code editor bhi nayi language mein dobara bharo
    try {
      if (typeof showEx === "function" && typeof currentEx !== "undefined" && document.getElementById("codeInput")) {
        showEx(currentEx);
      }
    } catch (e) {}
  }

  // ---------- CHECKER: bacha hua Hinglish dhundta hai ----------
  // Use: English chuno, page kholo, F12 -> Console -> CMLang.untranslated()
  var HINGLISH = /\b(hai|hain|hoga|hogi|hota|hoti|hote|ka|ke|ki|ko|se|mein|par|pe|aur|ya|yeh|ye|woh|jo|kya|kyu|nahi|karo|kare|karna|karte|karta|karti|kar|banao|banata|banate|dekho|seekho|sikho|sikhna|batao|badlo|chalao|likho|dalo|laao|apna|apne|aapka|aap|tum|tumhara|mera|meri|mere|hum|bhi|toh|abhi|sirf|sab|sare|saare|bahut|thoda|thode|ek|teen|pehle|phir|jab|tak|liye|wala|wale|raha|rahe|gaya|gayi|sakte|sakta|sakti|chahiye|chahte|lekin|kuch|koi|yahan|wahan|aaj|baar|naam|aasaan|tarike|tarika|shuru|seedha|dobara|wapas|jaankari|bhasha)\b/i;

  function untranslated() {
    if (getLang() === DEFAULT_LANG) {
      console.log("Pehle Settings mein English chuno, phir ye command dobara chalao.");
      return [];
    }
    var found = {};
    function check(txt, tag) {
      var s = (txt || "").replace(/\s+/g, " ").trim();
      if (s.length > 1 && HINGLISH.test(s)) found[s] = tag;
    }
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var p = n.parentElement;
      if (!p || p.closest("script,style,noscript,textarea")) continue;
      check(n.nodeValue, p.closest("pre,code") ? "code" : "text");
    }
    document.querySelectorAll("textarea").forEach(function (ta) {
      ta.value.split("\n").forEach(function (line) { check(line, "demo"); });
    });
    document.querySelectorAll("[placeholder],[title],[aria-label]").forEach(function (el) {
      ATTRS.forEach(function (a) { if (el.hasAttribute(a)) check(el.getAttribute(a), "attr"); });
    });
    var list = Object.keys(found);
    console.log("Hinglish text bacha hua: " + list.length);
    list.forEach(function (s) { console.log("[" + found[s] + "] " + s); });
    return list;
  }

  window.CMLang = {
    LANGS: LANGS,
    get: getLang,
    set: setLang,
    apply: refresh,
    tr: tr,
    untranslated: untranslated,
    add: function (entries, pairs) {
      addEntries(entries || []);
      addPairs(pairs || []);
      if (inited) refresh();
    }
  };

  // ---------- Code Master AI ko selected language bhejna ----------
  var originalFetch = window.fetch;
  window.fetch = function (url, options) {
    try {
      var u = typeof url === "string" ? url : url.url;
      if (u && u.indexOf("/api/chat") !== -1 && options && typeof options.body === "string") {
        var body = JSON.parse(options.body);
        body.language = getLang();
        options = Object.assign({}, options, { body: JSON.stringify(body) });
      }
    } catch (e) {}
    return originalFetch.call(this, url, options);
  };

  // ---------- navbar mein Settings link (agar HTML mein pehle se na ho) ----------
  function addSettingsLink() {
    if (/settings\.html$/.test(location.pathname)) return;
    if (document.querySelector('a[href="settings.html"]')) return;
    var done = false;

    var list = document.querySelector(".nav-links");
    if (list) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "settings.html";
      a.textContent = "⚙️ Settings";
      li.appendChild(a);
      list.appendChild(li);
      done = true;
    }

    var mobile = document.getElementById("mobileMenu");
    if (mobile) {
      var m = document.createElement("a");
      m.href = "settings.html";
      m.textContent = "⚙️ Settings";
      mobile.appendChild(m);
      done = true;
    }

    if (!done) {
      var f = document.createElement("a");
      f.href = "settings.html";
      f.title = "Settings";
      f.textContent = "⚙️";
      f.style.cssText =
        "position:fixed;left:20px;bottom:20px;width:46px;height:46px;border-radius:50%;" +
        "background:#1f2937;color:#fff;display:flex;align-items:center;justify-content:center;" +
        "font-size:22px;text-decoration:none;z-index:9998;box-shadow:0 4px 14px rgba(0,0,0,.35)";
      document.body.appendChild(f);
    }
  }

  function init() {
    addSettingsLink();
    refresh();
    observer = new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(scan, 200);
    });
    resume();
    inited = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
// ===== Code Master: i18n-pages.js =====
CMLang.add(
  [
    // ---------- FIXES: ye keys pehle match nahi hoti thi ----------
    ["web developmentseekho aasaan tarike se", `Learn Web Development<br/><span class="gradient-text">the Easy Way</span>`],
    ["hd videos se seekhoconcepts ko visually samjho", `Learn with HD Videos<br/><span class="gradient-text">Understand Concepts Visually</span>`],
    ["hd=", "HD"],
    ["1. bahari website", "1. External website"],
    ["2. apna dusra page", "2. Another page of your own"],
    ["3. same page ka section", "3. A section of the same page"],
    ["5. phone (mobile me direct call", "5. Phone (direct call on mobile"],
    ["html css js seekhne ki website", "A website for learning HTML CSS JS"],

    // ---------- Settings page ----------
    ["apni language, profile aur seekhne ki jaankari", "Change your language, profile and learning details here"],
    ["bhasha (language)", "Language"],
    ["poori website aur code master ai isi bhasha mein chalenge", "The whole website and Code Master AI will use this language"],
    ["mera profile=", "My Profile"],
    ["naam=", "Name"],
    ["save karo=", "Save"],
    ["meri seekhne ki jaankari=", "My Learning Details"],
    ["night mode mein aankhon par kam zor padta hai", "Night mode is easier on your eyes"],
    ["shuruaati sawaal=", "Welcome Questions"],
    ["naam aur seekhne ke sawaal dobara bharna ho to", "Press this if you want to fill in your name and learning questions again"],
    ["onboarding dobara shuru karo=", "Restart Onboarding"],
    ["mera data=", "My Data"],
    ["ye sara data sirf is browser mein save hota hai", "All of this data is saved only in this browser. You can download or delete it. After deleting, the welcome questions will appear again"],
    ["download my data=", "Download My Data"],
    ["sara data hatao=", "Clear All Data"],

    // ---------- JS se aane wala text: welcome message (script.js) ----------
    ["seedha action mein aaye ho — respect", "You jumped straight into action — respect"],
    ["freelancing se apni zindagi control karo — sahi raah hai", "Take control of your life with freelancing — you're on the right path"],
    ["apna startup banana hai? coding tumhari superpower hai", "Want to build your own startup? Coding is your superpower"],
    ["career mein coding ek game-changer hai — bilkul sahi decision", "Coding is a game-changer for a career — absolutely the right decision"],
    ["students ke liye coding", "Coding is one of the best skills a student can have. Keep the fire burning"],

    // ---------- JS se aane wala text: video modal (video.js) ----------
    ["document object model (dom) ek tree structure hai", "The Document Object Model (DOM) is a tree structure in which all HTML elements are nodes. JavaScript can read and modify these nodes."],
    ["har html element ek rectangular box hai", "Every HTML element is a rectangular box made up of Content, Padding, Border and Margin. The Box Model is the most important concept in CSS layout."],
    ["loops se repetitive tasks efficiently karte hain", "Loops let you perform repetitive tasks efficiently. A for loop runs with a counter, a while loop checks a condition, and forEach works on arrays."],
    ["flexbox ek 1d layout system hai", "Flexbox is a 1D layout system that arranges items in a row or a column. Positioning is controlled with justify-content and align-items."],
    ["css grid ek 2d layout system hai", "CSS Grid is a 2D layout system that places items in both rows and columns. Grid is perfect for complex page layouts."],
    ["events user actions ke responses hain", "Events are responses to user actions — click, hover, keypress, submit. With addEventListener, JavaScript can \"listen\" for these events."],
    ["javascript single-threaded hai but asynchronous code", "JavaScript is single-threaded, but asynchronous code allows non-blocking operations. Promises and async/await handle API calls and file reads."],
    ["media queries se css different screen sizes", "With Media Queries, CSS defines different rules for different screen sizes. In the mobile-first approach, you design for mobile first and then expand to desktop."],
    ["html forms user se data collect karte hain", "HTML Forms collect data from the user. Input types (text, email, password, number, checkbox), validation attributes and form submission are all covered here."],
    ["video jald aayegi", "Video coming soon"],
    ["abhi koi youtube video link nahi hai", "There is no YouTube video link yet"]
  ],
  [
    // ---------- Home: live code editor (script.js) ----------
    ["Mera pehla HTML page", "My first HTML page"],
    ["Yeh ek box hai CSS se banaya!", "This is a box made with CSS!"],
    ["Animations aur styling seekho", "Learn animations and styling"],
    ["➕ Badhao", "➕ Increase"],
    ["➖ Ghataao", "➖ Decrease"],

    // ---------- Home: typing animation (script.js) ----------
    ["HTML ka structure", "HTML structure"],
    ["Meri Website", "My Website"],
    ["Seekhna shuru karne k liye! SURU KARO button ko", "To start learning, press the GET STARTED button"],
    ["click karo or sikna suru karo.</p>", "and begin your journey.</p>"]
  ]
);