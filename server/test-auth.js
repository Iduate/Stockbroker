import fetch from 'node-fetch';

async function testAuthEndpoints() {
  try {
    // Test forgot password
    console.log('Testing forgot password endpoint...');
    const forgotResponse = await fetch('http://localhost:3001/api/auth/request-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'davididuate11@gmail.com' })
    });
    
    const forgotData = await forgotResponse.json();
    console.log('Forgot password response:', forgotData);

    if (forgotData.resetToken) {
      // Test reset password
      console.log('\nTesting reset password endpoint...');
      const resetResponse = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: forgotData.resetToken,
          password: 'newPassword123'
        })
      });
      
      const resetData = await resetResponse.json();
      console.log('Reset password response:', resetData);
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAuthEndpoints(); 