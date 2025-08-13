 // Google Sheets integration for dynamic menu loading
 document.addEventListener('DOMContentLoaded', function() {
  // Google Sheet's published CSV URL (more reliable than JSON)
  const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSQv44TmuMRWX46hBw7rQYGTl8UADb_YDiQNEXkLaFXzIVZfq_E-gma75byaJPr9Jf0jhn7zIJyGoiQ/pub?output=csv';
  
  
  // Function to create menu item HTML using existing CSS styles
  function createMenuItem(item) {
      return `
          <div class="section5-container-item">
              <div class="product-image">
                  <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/placeholder.png'">
              </div>
              <div class="product-info">
                  <h3>${item.name}</h3>
                  <div class="product-prices">
                      <p><span>ราคา</span>${item.price} บาท</p>
                  </div>
              </div>
          </div>
      `;
  }
  
  // Function to load menu from Google Sheets
  async function loadMenuFromGoogleSheets() {
      // แสดงข้อความโหลดเมนู
      document.getElementById('menu-grid').innerHTML = `
          <div style="padding: 2rem; text-align: center;">
              <h3>โหลดเมนู...</h3>
          </div>
      `;
      
      try {
          console.log('Attempting to fetch from Google Sheets...');
          const response = await fetch(GOOGLE_SHEET_URL);
          console.log('Response status:', response.status);
          
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const csvText = await response.text();
          console.log('Google Sheets CSV received:', csvText);
          
          // Parse CSV data
          const rows = csvText.split('\n').map(row => row.split(','));
          const headers = rows[0]; // First row contains headers
          const dataRows = rows.slice(1); // Skip header row
          
          console.log('Headers:', headers);
          console.log('Data rows:', dataRows);
          
          // Map your exact column structure: A=Image, B=Name, C=Price
          const menuItems = dataRows
              .filter(row => row.length >= 3) // Ensure row has at least 3 columns
              .map(row => ({
                  image: row[0]?.trim(),           // Column A: Image URLs
                  name: row[1]?.trim(),            // Column B: Product names
                  price: row[2]?.trim()            // Column C: Prices
              }))
              .filter(item => item.image && item.name && item.image !== 'Image'); // Filter out empty rows and header
          
          console.log('Processed menu items:', menuItems);
          displayMenu(menuItems);
          
      } catch (error) {
          console.error('ข้อผิดพลาดในการโหลดจาก Google Sheets:', error);
          document.getElementById('menu-grid').innerHTML = `
              <div class="section5-container-item">
                  <h3>ข้อผิดพลาดในการโหลดเมนู</h3>
                  <p>${error.message}</p>
                  <p>กรุณาตรวจสอบการตั้งค่า Google Sheets ของคุณ</p>
              </div>
          `;
      }
  }
  
  // Function to display menu items
  function displayMenu(menuItems) {
      const menuGrid = document.getElementById('menu-grid');
      menuGrid.innerHTML = menuItems.map(item => createMenuItem(item)).join('');
  }
  
  // Load menu when page loads
  loadMenuFromGoogleSheets();
});