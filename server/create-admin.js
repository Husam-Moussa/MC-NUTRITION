const axios = require('axios');

const createAdminUser = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Admin',
      email: 'admin@mcnutrition.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created successfully:', response.data);
  } catch (error) {
    console.error('Error creating admin user:', error.response?.data || error.message);
  }
};

createAdminUser(); 