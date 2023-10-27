const loggedIn = localStorage.getItem('loggedIn'); {

  if (loggedIn === 'true') {

  } else {
    alert("This is an exclusive page. Create an account to continiue.")
    window.location.href = '/tctam-chat';
  }
}
