document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    console.log('Sending login request...');
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('username', username); // Save the username to localStorage
        alert(data.message);
        window.location.href = 'chat.html'; // Redirect to chat page
      }
       else {
      alert(data.message || 'Invalid login');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Unable to login. Please try again later.');
  }
});
