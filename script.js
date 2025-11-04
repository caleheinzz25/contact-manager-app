        // Initialize contacts array
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        
        // DOM elements
        const contactForm = document.getElementById('contactForm');
        const contactsList = document.getElementById('contactsList');
        const addContactBtn = document.getElementById('addContactBtn');
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const noContactsMessage = document.getElementById('noContactsMessage');
        
        // Form submission handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const company = document.getElementById('company').value;
            const jobTitle = document.getElementById('jobTitle').value;
            const category = document.getElementById('category').value;
            const nickname = document.getElementById('nickname').value;
            
            // Add to contacts array
            contacts.push({
                id: Date.now(), // Unique ID
                name,
                email,
                phone,
                company,
                jobTitle,
                category,
                nickname
            });
            
            // Save to localStorage
            localStorage.setItem('contacts', JSON.stringify(contacts));
            
            // Clear the form
            contactForm.reset();
            
            // Refresh the contacts list
            renderContacts();
        });
        
        // Function to render contacts
        function renderContacts() {
            contactsList.innerHTML = '';
            
            if (contacts.length === 0) {
                noContactsMessage.style.display = 'block';
                return;
            } else {
                noContactsMessage.style.display = 'none';
            }
            
            const filteredContacts = filterContacts();
            
            filteredContacts.forEach(contact => {
                const contactElement = document.createElement('div');
                contactElement.className = 'contact-card bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all duration-300';
                
                contactElement.innerHTML = `
                    <div class="flex items-center mb-3">
                        <div class="avatar mr-3" style="background-color: ${getRandomColor()}">
                            ${contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 class="font-semibold text-lg">${contact.name}</h3>
                            <p class="text-sm text-gray-600">${contact.email}</p>
                        </div>
                    </div>
                    <p class="text-gray-600"><i class="fas fa-phone mr-2"></i>${contact.phone}</p>
                    ${contact.company ? `<p class="text-gray-600"><i class="fas fa-building mr-2"></i>${contact.company}</p>` : ''}
                    ${contact.jobTitle ? `<p class="text-gray-600"><i class="fas fa-briefcase mr-2"></i>${contact.jobTitle}</p>` : ''}
                    <div class="mt-4 flex flex-wrap gap-2">
                        ${contact.nickname ? `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">@${contact.nickname}</span>` : ''}
                        <span class="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                            ${getCategoryName(contact.category)}
                        </span>
                    </div>
                    <div class="mt-4 flex space-x-2">
                        <button class="edit-btn px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200" onclick="editContact('${contact.id}')">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button class="delete-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200" onclick="deleteContact('${contact.id}')">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                `;
                
                contactsList.appendChild(contactElement);
            });
        }
        
        // Function to filter contacts based on search and category
        function filterContacts() {
            const searchTerm = searchInput.value.toLowerCase();
            const categoryValue = categoryFilter.value;
            
            return contacts.filter(contact => {
                const matchesSearch = 
                    contact.name.toLowerCase().includes(searchTerm) || 
                    contact.email.toLowerCase().includes(searchTerm) || 
                    (contact.nickname && contact.nickname.toLowerCase().includes(searchTerm));
                
                const matchesCategory = !categoryValue || contact.category === categoryValue;
                
                return matchesSearch && matchesCategory;
            });
        }
        
        // Function to delete a contact
        function deleteContact(id) {
            contacts = contacts.filter(contact => contact.id !== id);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            renderContacts();
        }
        
        // Function to get category name
        function getCategoryName(category) {
            const categories = {
                'friend': 'Friend',
                'family': 'Family',
                'work': 'Work',
                'client': 'Client',
                'other': 'Other'
            };
            return categories[category] || 'Unknown';
        }
        
        // Function to generate random color
        function getRandomColor() {
            const colors = ['#4F46E5', '#7C3AED', '#10B981', '#0EA5E9', '#F59E0B'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        // Event listeners for filtering
        searchInput.addEventListener('input', renderContacts);
        categoryFilter.addEventListener('change', renderContacts);
        
        // Initial render
        renderContacts();