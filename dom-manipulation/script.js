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
    // Set up event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', showAddQuoteForm);
    
    // Initialize category dropdown
    updateCategoryDropdown();
    
    // Show initial quote
    showRandomQuote();
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
}

// Function to show the add quote form
function showAddQuoteForm() {
    addQuoteForm.style.display = 'block';
    addQuoteForm.classList.add('slide-in');
    
    // Focus on first input
    document.getElementById('newQuoteText').focus();
}

// Function to hide the add quote form
function hideAddQuoteForm() {
    addQuoteForm.classList.add('slide-out');
    
    setTimeout(() => {
        addQuoteForm.style.display = 'none';
        addQuoteForm.classList.remove('slide-in', 'slide-out');
        
        // Clear form inputs
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
}

// Function to update category dropdown
function updateCategoryDropdown() {
    // Get unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing options except "All Categories"
    while (categorySelect.children.length > 1) {
        categorySelect.removeChild(categorySelect.lastChild);
    }
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });
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