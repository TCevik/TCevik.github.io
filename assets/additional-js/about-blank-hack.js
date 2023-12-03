/* about:blank tab */
function openNewTab() {
    var newTab = window.open('about:blank', '_blank');
    var iframe = newTab.document.createElement('iframe');
    iframe.src = '/';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    newTab.document.body.appendChild(iframe);
    
    var link = newTab.document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = '/assets/asfalt-light.png';
    
    var head = newTab.document.head || newTab.document.getElementsByTagName('head')[0];
    head.appendChild(link);
    
    newTab.document.title = '‎';
    newTab.document.body.style.overflow = 'hidden';
};

/* about:blank tab */
function openSecretTab() {
    var tabName = prompt('Voer de naam van het tabblad in:');
    var faviconLink = prompt('Voer de favicon-link in:');

    if (tabName !== null && tabName !== '' && faviconLink !== null && faviconLink !== '') {
        var newTab = window.open('about:blank', '_blank');
        var iframe = newTab.document.createElement('iframe');
        iframe.src = '/';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        newTab.document.body.appendChild(iframe);
        
        var link = newTab.document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = faviconLink;
        
        var head = newTab.document.head || newTab.document.getElementsByTagName('head')[0];
        head.appendChild(link);
        
        newTab.document.title = tabName;
        newTab.document.body.style.overflow = 'hidden';
    } else {
        notification('Tabbladnaam en/of favicon-link mogen niet leeg zijn.');
    }
}

/* ga naar secret school hacks */
function scrollToSecret() {
    var destination = document.getElementById("showMenu").offsetTop;
    window.scrollTo({
        top: destination,
        behavior: "smooth"
    });
}
var keySequence = [];
document.addEventListener('keydown', function(event) {
    keySequence.push(event.key);
    if (keySequence.join('') === 'ballondoos') {
        showMenu();
        setTimeout(scrollToSecret, 100);
    }
});
function showMenu() {
    var menu = document.getElementById('showMenu');
    menu.style.display = 'inline';
}

/* kijk of de gebruiker is ingelogd */
firebase.auth().onAuthStateChanged(function(user) {
    var secretTabBtn = document.getElementById('openSecretTabBtn');
    document.getElementById('loginMessage').style.margin = '0 auto';
    document.getElementById('openNewTabBtn').style.margin = '0 auto';
    secretTabBtn.style.margin = '0 auto';

    if (user) {
        document.getElementById('loginMessage').style.display = 'none';
        document.getElementById('openNewTabBtn').style.display = 'block';
        secretTabBtn.style.display = 'block';
        secretTabBtn.disabled = false;
    } else {
        document.getElementById('loginMessage').style.display = 'block';
        document.getElementById('openNewTabBtn').style.display = 'block';
        secretTabBtn.style.display = 'block';
        secretTabBtn.disabled = true;
    }
});