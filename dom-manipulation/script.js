// Quote Generator with Advanced DOM Manipulation

// Initial quotes array with sample data
let quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "motivation"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon",
        category: "life"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        category: "inspiration"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "success"
    },
    {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu",
        category: "wisdom"
    }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const addQuoteForm = document.getElementById('addQuoteForm');
const categorySelect = document.getElementById('categorySelect');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadQuotes();
    createAddQuoteForm();
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', showAddQuoteForm);
    updateCategoryDropdown();
    // Import/export event listeners
    const exportBtn = document.getElementById('exportQuotes');
    if (exportBtn) exportBtn.addEventListener('click', exportQuotes);
    const importInput = document.getElementById('importFile');
    if (importInput) importInput.addEventListener('change', importFromJsonFile);
    // Populate filter dropdown
    populateCategories();
    // Restore last filter
    const lastFilter = localStorage.getItem('lastCategoryFilter') || 'all';
    const filterSelect = document.getElementById('categoryFilter');
    if (filterSelect) {
        filterSelect.value = lastFilter;
    }
    filterQuotes();
    // Show last viewed quote if available (optional, can be removed if filter takes precedence)
    // const last = loadLastViewedQuote();
    // if (last) {
    //     displayQuote(last.text, last.author, last.category);
    // } else {
    //     showRandomQuote();
    // }
}

// Function to display a random quote
function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    let filteredQuotes = quotes;
    
    // Filter quotes by category if not "all"
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    
    if (filteredQuotes.length === 0) {
        displayQuote("No quotes available for this category.", "System", "info");
        return;
    }
    
    // Get random quote
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    displayQuote(randomQuote.text, randomQuote.author, randomQuote.category);
}

// Function to display a quote with enhanced styling
function displayQuote(text, author, category) {
    // Clear existing content
    quoteDisplay.innerHTML = '';
    
    // Create quote container
    const quoteContainer = document.createElement('div');
    quoteContainer.className = 'quote-container';
    
    // Create quote text element
    const quoteText = document.createElement('p');
    quoteText.className = 'quote-text';
    quoteText.textContent = `"${text}"`;
    
    // Create author element
    const quoteAuthor = document.createElement('p');
    quoteAuthor.className = 'quote-author';
    quoteAuthor.textContent = `- ${author}`;
    
    // Create category badge
    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'category-badge';
    categoryBadge.textContent = category;
    
    // Append elements to container
    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteAuthor);
    quoteContainer.appendChild(categoryBadge);
    
    // Add animation class
    quoteContainer.classList.add('fade-in');
    
    // Append to display area
    quoteDisplay.appendChild(quoteContainer);
    
    // Remove animation class after animation completes
    setTimeout(() => {
        quoteContainer.classList.remove('fade-in');
    }, 500);
    // Save last viewed quote in sessionStorage
    saveLastViewedQuote({ text, author, category });
}

// Function to create the add quote form dynamically
function createAddQuoteForm() {
    const container = document.getElementById('addQuoteFormContainer');
    if (!container) return;
    
    // Create form wrapper
    const form = document.createElement('div');
    form.id = 'addQuoteForm';
    form.className = 'add-quote-form';
    form.style.display = 'none';

    // Form inner HTML
    form.innerHTML = `
        <h3>Add New Quote</h3>
        <div class="form-group">
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        </div>
        <div class="form-group">
            <input id="newQuoteAuthor" type="text" placeholder="Enter quote author" />
        </div>
        <div class="form-group">
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        </div>
        <div class="form-actions">
            <button id="addQuoteSubmit" class="btn btn-success">Add Quote</button>
            <button id="addQuoteCancel" class="btn btn-cancel">Cancel</button>
        </div>
    `;
    container.appendChild(form);

    // Add event listeners for buttons
    document.getElementById('addQuoteSubmit').onclick = addQuote;
    document.getElementById('addQuoteCancel').onclick = hideAddQuoteForm;
}

// Function to show the add quote form
function showAddQuoteForm() {
    const addQuoteForm = document.getElementById('addQuoteForm');
    if (!addQuoteForm) return;
    addQuoteForm.style.display = 'block';
    addQuoteForm.classList.add('slide-in');
    document.getElementById('newQuoteText').focus();
}

// Function to hide the add quote form
function hideAddQuoteForm() {
    const addQuoteForm = document.getElementById('addQuoteForm');
    if (!addQuoteForm) return;
    addQuoteForm.classList.add('slide-out');
    setTimeout(() => {
        addQuoteForm.style.display = 'none';
        addQuoteForm.classList.remove('slide-in', 'slide-out');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteAuthor').value = '';
        document.getElementById('newQuoteCategory').value = '';
    }, 300);
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteAuthor = document.getElementById('newQuoteAuthor').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
    
    // Validation
    if (!quoteText || !quoteAuthor || !quoteCategory) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }
    
    // Create new quote object
    const newQuote = {
        text: quoteText,
        author: quoteAuthor,
        category: quoteCategory.toLowerCase()
    };
    
    // Add to quotes array
    quotes.push(newQuote);
    
    // Update category dropdown
    updateCategoryDropdown();
    
    // Hide form
    hideAddQuoteForm();
    
    // Show success notification
    showNotification('Quote added successfully!', 'success');
    
    // Display the new quote
    displayQuote(newQuote.text, newQuote.author, newQuote.category);
    saveQuotes();
    populateCategories();
}

// Function to update category dropdown
function updateCategoryDropdown() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    while (categorySelect.children.length > 1) {
        categorySelect.removeChild(categorySelect.lastChild);
    }
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });
    populateCategories();
}

// Function to show notifications
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add category change event listener
categorySelect.addEventListener('change', function() {
    showRandomQuote();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to add quote when form is visible
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && addQuoteForm.style.display !== 'none') {
        addQuote();
    }
    
    // Escape to hide form
    if (event.key === 'Escape' && addQuoteForm.style.display !== 'none') {
        hideAddQuoteForm();
    }
    
    // Space to show new quote
    if (event.key === ' ' && event.target === document.body) {
        event.preventDefault();
        showRandomQuote();
    }
});

// Ensure addQuote is globally accessible
window.addQuote = addQuote;
window.hideAddQuoteForm = hideAddQuoteForm;

// --- Local Storage Integration ---
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const stored = localStorage.getItem('quotes');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                quotes = parsed;
            }
        } catch (e) {
            // Ignore parse errors, fallback to default
        }
    }
}

// --- Session Storage for Last Viewed Quote ---
function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function loadLastViewedQuote() {
    const stored = sessionStorage.getItem('lastViewedQuote');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {}
    }
    return null;
}

// --- JSON Export ---
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// --- JSON Import ---
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                updateCategoryDropdown();
                showNotification('Quotes imported successfully!', 'success');
            } else {
                showNotification('Invalid JSON format.', 'error');
            }
        } catch (err) {
            showNotification('Failed to import quotes.', 'error');
        }
    };
    fileReader.readAsText(file);
}

// --- Category Filtering System ---
function populateCategories() {
    const filterSelect = document.getElementById('categoryFilter');
    if (!filterSelect) return;
    // Get unique categories
    const categories = [...new Set(quotes.map(q => q.category))];
    // Save current selection
    const prevValue = filterSelect.value;
    // Remove all except 'all'
    while (filterSelect.children.length > 1) {
        filterSelect.removeChild(filterSelect.lastChild);
    }
    // Add categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        filterSelect.appendChild(option);
    });
    // Restore previous selection if possible
    if (categories.includes(prevValue)) {
        filterSelect.value = prevValue;
    } else {
        filterSelect.value = 'all';
    }
}

function filterQuotes() {
    const filterSelect = document.getElementById('categoryFilter');
    const selected = filterSelect ? filterSelect.value : 'all';
    // Save filter to localStorage
    localStorage.setItem('lastCategoryFilter', selected);
    // Filter and display quotes
    let filteredQuotes = quotes;
    if (selected !== 'all') {
        filteredQuotes = quotes.filter(q => q.category === selected);
    }
    if (filteredQuotes.length === 0) {
        displayQuote('No quotes available for this category.', 'System', selected);
        return;
    }
    // Show a random quote from filtered
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    displayQuote(randomQuote.text, randomQuote.author, randomQuote.category);
}

// Make filterQuotes globally accessible
window.filterQuotes = filterQuotes;

// --- Server Sync Simulation ---
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Simulated endpoint
const SYNC_INTERVAL = 30000; // 30 seconds

function showSyncNotification(message, type = 'info') {
    const notif = document.getElementById('syncNotification');
    if (!notif) return;
    notif.textContent = message;
    notif.style.color = type === 'error' ? 'red' : (type === 'success' ? 'green' : '#333');
    notif.style.fontWeight = 'bold';
    setTimeout(() => { notif.textContent = ''; }, 5000);
}

async function fetchQuotesFromServer() {
    try {
        const res = await fetch(SERVER_URL);
        if (!res.ok) throw new Error('Server error');
        // Simulate server quotes as array of {text, author, category}
        const data = await res.json();
        // We'll only use the first 10 for demo, and map to our structure
        return data.slice(0, 10).map(post => ({
            text: post.title,
            author: 'Server',
            category: 'server'
        }));
    } catch (e) {
        showSyncNotification('Failed to fetch from server.', 'error');
        return [];
    }
}

async function syncQuotes() {
    showSyncNotification('Syncing with server...');
    const serverQuotes = await fetchQuotesFromServer();
    if (!serverQuotes.length) return;
    let conflicts = 0, added = 0;
    // Merge: if a quote with same text exists, server wins
    serverQuotes.forEach(serverQ => {
        const localIdx = quotes.findIndex(q => q.text === serverQ.text);
        if (localIdx !== -1) {
            // Conflict: overwrite local with server
            if (JSON.stringify(quotes[localIdx]) !== JSON.stringify(serverQ)) {
                quotes[localIdx] = serverQ;
                conflicts++;
            }
        } else {
            quotes.push(serverQ);
            added++;
        }
    });
    saveQuotes();
    updateCategoryDropdown();
    populateCategories();
    filterQuotes();
    if (conflicts > 0 || added > 0) {
        showSyncNotification(`Sync complete. ${added} new, ${conflicts} conflicts resolved (server wins).`, 'success');
        alert('Quotes synced with server!');
    } else {
        showSyncNotification('Sync complete. No changes.', 'success');
        alert('Quotes synced with server!');
    }
}

// Periodic sync
setInterval(syncQuotes, SYNC_INTERVAL);

// Sync Now button
const syncNowBtn = document.getElementById('syncNow');
if (syncNowBtn) syncNowBtn.addEventListener('click', syncQuotes);

// Make syncQuotes and fetchQuotesFromServer globally accessible
window.syncQuotes = syncQuotes;
window.fetchQuotesFromServer = fetchQuotesFromServer;

// Optionally, POST new quotes to server (not required for mock, but can be added for realism)
// async function postQuoteToServer(quote) {
//     await fetch(SERVER_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(quote)
//     });
// } 