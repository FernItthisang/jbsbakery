// Google Sheets CSV URL
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKO1gHxzzbjlR0Gnva1GFGIzpsmSpEMz4z9IA67nIR6e9FQRw7LJt6rPeiclOTudRoI9Y82PKU0y4m/pub?gid=1399678055&single=true&output=csv';

let productsData = []; // Store products for filtering

// Fetch CSV data and process it
async function fetchProducts() {
    try {
        const response = await fetch(CSV_URL);
        const csvData = await response.text();
        productsData = parseCSV(csvData);

        // Debugging parsed data
        console.log('Parsed Products Data:', productsData);

        populateTags(productsData);
        populateProducts(productsData);
    } catch (error) {
        console.error('Error fetching CSV data:', error);
    }
}

// Parse CSV into an array of objects
function parseCSV(csv) {
    const rows = csv.split('\n').filter(row => row.trim() !== ''); // Remove empty lines
    const headers = rows[0].split(',').map(header => header.trim());

    return rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.trim());
        return headers.reduce((acc, header, index) => {
            acc[header] = values[index] || ''; // Assign default empty string if value is missing
            return acc;
        }, {});
    });
}

// Populate tags dynamically
function populateTags(data) {
    const tagsContainer = document.getElementById('tags-container');
    tagsContainer.innerHTML = ''; // Clear existing tags

    const uniqueTags = new Set();

    data.forEach(product => {
        const tags = product.Tags?.split(',').map(tag => tag.trim());
        if (tags) tags.forEach(tag => uniqueTags.add(tag));
    });

    // Create a "Show All" tag
    const allTag = document.createElement('button');
    allTag.textContent = 'Show All';
    allTag.classList.add('tag');
    allTag.addEventListener('click', () => populateProducts(productsData));
    tagsContainer.appendChild(allTag);

    // Create individual tags
    uniqueTags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.textContent = tag;
        tagButton.classList.add('tag');
        tagButton.addEventListener('click', () => filterProductsByTag(tag));
        tagsContainer.appendChild(tagButton);
    });
}

function populateProducts(data) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; // Clear existing products

    data.forEach(product => {
        console.log('Product Data:', product); // Debugging product data

        // Collect image URLs from the "Images" column
        const images = product.Images?.split(',').map(img => img.trim()) || [];
        console.log('Images:', images); // Debugging the images array

        if (images.length === 0) {
            console.error('No images found for product:', product.Name);
            return; // Skip product if no images
        }

        const prices = [];

        // Dynamically check and add filled prices
        const priceFields = {
            'Price': 'ราคา',
            'Price Large': 'ไซส์ใหญ่',
            'Price Medium': 'ไซส์กลาง',
            'Price Small': 'ไซส์เล็ก',
            'Circle': 'ทรงกลม',
            'Oval': 'ทรงรี',
            'Price Extra': 'เพิ่มไข่'
        };

        Object.keys(priceFields).forEach(priceField => {
            if (product[priceField] && !isNaN(parseFloat(product[priceField]))) {
                prices.push(
                    `<p><span>${priceFields[priceField]}:</span> ${Math.round(parseFloat(product[priceField]))} บาท</p>`
                );
            }
        });

        // Create the product card
        const card = document.createElement('div');
        card.classList.add('product-card');

        let currentImageIndex = 0; // Track the current image index

        card.innerHTML = `
            <div class="product-image">
                <img src="${images[0]}" alt="${product.Name || 'Product'}" class="main-image">
                <div class="product-badge">${product.Badge || ''}</div>
            </div>
            <div class="product-info">
                <h3>${product.Name || 'Unnamed Product'}</h3>
                <h4>${product.Description || 'No description available.'}</h4>
                <div class="product-prices">
                    ${prices.length > 0 ? prices.join('') : '<h4>No prices available.</h4>'}
                </div>
            </div>
        `;

        // Add functionality to change the main image on click
        const mainImage = card.querySelector('.main-image');
        mainImage.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length; // Cycle through images
            mainImage.src = images[currentImageIndex]; // Update the main image
            console.log('Changed to image:', mainImage.src); // Debugging image switching
        });

        grid.appendChild(card); // Add card to the grid
    });
}

// Filter products by tag
function filterProductsByTag(tag) {
    const filteredProducts = productsData.filter(product => {
        const tags = product.Tags?.split(',').map(t => t.trim());
        return tags && tags.includes(tag);
    });
    populateProducts(filteredProducts);
}

// Fetch data on page load
fetchProducts();