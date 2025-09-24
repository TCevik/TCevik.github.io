var metaTag = document.createElement('meta');
metaTag.name = 'viewport';
metaTag.content = 'width=device-width, initial-scale=1';

var head = document.querySelector('head');
head.appendChild(metaTag);

var manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = '/app.webmanifest';
var headElement = document.head || document.getElementsByTagName('head')[0];
headElement.insertBefore(manifestLink, headElement.firstChild);

/* google analytics */
(function () {
	var script = document.createElement('script');
	script.async = true;
	script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7KL389S9VR';

	var firstScript = document.getElementsByTagName('script')[0];
	firstScript.parentNode.insertBefore(script, firstScript);

	window.dataLayer = window.dataLayer || [];
	function gtag() { dataLayer.push(arguments); }
	gtag('js', new Date());

	gtag('config', 'G-7KL389S9VR');
})();

/* DIT MOET WEG NA OPENING NIEUWE SITE */
const path = window.location.pathname;
const newUrl = "https://tctam-site-oud.github.io" + path;
window.location.replace(newUrl);