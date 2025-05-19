document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettingsButton = document.getElementById('close-settings-button');
    const themeToggleButton = document.getElementById('theme-toggle');
    const languageSelect = document.getElementById('language-select');
    const searchSourcesList = document.getElementById('search-sources-list');
    const addSourceButton = document.getElementById('add-source-button');

    // Edit Modal Elements
    const editSourceModal = document.getElementById('edit-source-modal');
    const editSourceNameInput = document.getElementById('edit-source-name');
    const editSourceUrlInput = document.getElementById('edit-source-url');
    const editSourceFaviconInput = document.getElementById('edit-source-favicon');
    const editSourceLogoInput = document.getElementById('edit-source-logo');
    const editSourceIdInput = document.getElementById('edit-source-id'); // Hidden input for ID
    const saveSourceButton = document.getElementById('save-source-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');

    let currentSearchEngines = getSearchEngines();
    let draggedItem = null;

    // --- Settings Panel Toggle ---
    settingsButton.addEventListener('click', () => {
        settingsPanel.classList.add('open');
    });

    closeSettingsButton.addEventListener('click', () => {
        settingsPanel.classList.remove('open');
    });

    // Close settings panel if clicked outside
    document.addEventListener('click', (event) => {
        if (!settingsPanel.contains(event.target) && !settingsButton.contains(event.target) && settingsPanel.classList.contains('open')) {
            settingsPanel.classList.remove('open');
        }
    });

    // --- Theme Toggle ---
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('userTheme', theme);
    }

    themeToggleButton.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(currentTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('userTheme') || 'light'; // Default to light
    applyTheme(savedTheme);

    // --- Language Selection ---
    languageSelect.addEventListener('change', (event) => {
        setLanguage(event.target.value);
        // Re-render search sources if language changes as button text might change
        renderSearchSources();
    });

    // Load saved language
    const savedLanguage = getInitialLanguage();
    languageSelect.value = savedLanguage;
    setLanguage(savedLanguage); // This will also call applyTranslations

    // --- Search Sources Management ---
    function renderSearchSources() {
        searchSourcesList.innerHTML = ''; // Clear existing list
        currentSearchEngines.forEach((engine, index) => {
            const item = document.createElement('div');
            item.classList.add('search-source-item', 'neumorphic-button'); // Make it look like a button for consistency
            item.setAttribute('draggable', true);
            item.dataset.id = engine.id;
            item.dataset.index = index;

            const faviconImg = document.createElement('img');
            faviconImg.src = engine.favicon || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent pixel
            faviconImg.alt = `${engine.name} favicon`;
            faviconImg.classList.add('favicon');

            const nameSpan = document.createElement('span');
            nameSpan.textContent = engine.name;

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            // Edit SVG 按钮
            const editButton = document.createElement('button');
            editButton.classList.add('svg-icon-btn');
            editButton.innerHTML = `<svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M674.92049 167.601633l3.343673 3.176489 147.748572 147.748572a83.591837 83.591837 0 0 1 3.176489 114.896979l-3.155591 3.343674-431.083102 431.062204a83.591837 83.591837 0 0 1-54.355592 24.346122l-4.743837 0.125388H167.183673a62.693878 62.693878 0 0 1-62.589387-58.994939L104.489796 829.607184v-168.646531a83.591837 83.591837 0 0 1 21.232326-55.672163l3.260082-3.448163L560.044408 170.778122a83.591837 83.591837 0 0 1 114.876082-3.155591z m243.231347 639.414857a20.897959 20.897959 0 0 1 20.897959 20.897959v41.795918a20.897959 20.897959 0 0 1-20.897959 20.89796h-334.367347a20.897959 20.897959 0 0 1-20.897959-20.89796v-41.795918a20.897959 20.897959 0 0 1 20.897959-20.897959h334.367347zM500.924082 348.097306L188.081633 660.918857v147.748572l147.769469 0.020898 312.842449-312.842449-147.769469-147.790368z m417.227755 291.73551a20.897959 20.897959 0 0 1 20.897959 20.89796v41.795918a20.897959 20.897959 0 0 1-20.897959 20.897959h-167.183674a20.897959 20.897959 0 0 1-20.897959-20.897959v-41.795918a20.897959 20.897959 0 0 1 20.897959-20.89796h167.183674zM619.143837 229.877551L560.065306 288.97698l147.748572 147.748571 59.099428-59.078531L619.164735 229.877551z" fill="#222429"></path></svg>`;
            editButton.title = translate('edit');
            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(engine);
            });

            // Delete SVG 按钮
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('svg-icon-btn');
            deleteButton.innerHTML = `<svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M254.398526 804.702412l-0.030699-4.787026C254.367827 801.546535 254.380106 803.13573 254.398526 804.702412zM614.190939 259.036661c-22.116717 0-40.047088 17.910928-40.047088 40.047088l0.37146 502.160911c0 22.097274 17.930371 40.048111 40.047088 40.048111s40.048111-17.950837 40.048111-40.048111l-0.350994-502.160911C654.259516 276.948613 636.328122 259.036661 614.190939 259.036661zM893.234259 140.105968l-318.891887 0.148379-0.178055-41.407062c0-22.13616-17.933441-40.048111-40.067554-40.048111-7.294127 0-14.126742 1.958608-20.017916 5.364171-5.894244-3.405563-12.729929-5.364171-20.031219-5.364171-22.115694 0-40.047088 17.911952-40.047088 40.048111l0.188288 41.463344-230.115981 0.106424c-3.228531-0.839111-6.613628-1.287319-10.104125-1.287319-3.502777 0-6.89913 0.452301-10.136871 1.296529l-73.067132 0.033769c-22.115694 0-40.048111 17.950837-40.048111 40.047088 0 22.13616 17.931395 40.048111 40.048111 40.048111l43.176358-0.020466 0.292666 617.902982 0.059352 0 0 42.551118c0 44.233434 35.862789 80.095199 80.095199 80.095199l40.048111 0 0 0.302899 440.523085-0.25685 0-0.046049 40.048111 0c43.663452 0 79.146595-34.95 80.054267-78.395488l-0.329505-583.369468c0-22.135136-17.930371-40.047088-40.048111-40.047088-22.115694 0-40.047088 17.911952-40.047088 40.047088l0.287549 509.324054c-1.407046 60.314691-18.594497 71.367421-79.993892 71.367421l41.575908 1.022283-454.442096 0.26606 52.398394-1.288343c-62.715367 0-79.305207-11.522428-80.0645-75.308173l0.493234 76.611865-0.543376 0-0.313132-660.818397 236.82273-0.109494c1.173732 0.103354 2.360767 0.166799 3.561106 0.166799 1.215688 0 2.416026-0.063445 3.604084-0.169869l32.639375-0.01535c1.25355 0.118704 2.521426 0.185218 3.805676 0.185218 1.299599 0 2.582825-0.067538 3.851725-0.188288l354.913289-0.163729c22.115694 0 40.050158-17.911952 40.050158-40.047088C933.283394 158.01792 915.349953 140.105968 893.234259 140.105968zM774.928806 815.294654l0.036839 65.715701-0.459464 0L774.928806 815.294654zM413.953452 259.036661c-22.116717 0-40.048111 17.910928-40.048111 40.047088l0.37146 502.160911c0 22.097274 17.931395 40.048111 40.049135 40.048111 22.115694 0 40.047088-17.950837 40.047088-40.048111l-0.37146-502.160911C454.00054 276.948613 436.069145 259.036661 413.953452 259.036661z" fill="#272636"></path></svg>`;
            deleteButton.title = translate('delete');
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSearchSource(engine.id);
            });

            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(deleteButton);

            item.appendChild(faviconImg);
            item.appendChild(nameSpan);
            item.appendChild(actionsDiv);

            // Drag and Drop Event Listeners
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);

            searchSourcesList.appendChild(item);
        });
        updateCurrentSearchEngineDisplay(); // Update main page logo if sources change
    }

    function saveAndRerenderSources() {
        saveSearchEngines(currentSearchEngines);
        renderSearchSources();
        updateCurrentSearchEngineDisplay();
    }

    addSourceButton.addEventListener('click', () => {
        const newId = `custom-${Date.now()}`;
        const newSource = {
            id: newId,
            name: translate('defaultSourceName'), // Default name
            url: '',
            favicon: '',
            textLogo: ''
        };
        openEditModal(newSource, true); // true indicates it's a new source
    });

    // Handle ESC key press
    function handleKeyDown(e) {
        if (e.key === 'Escape' && editSourceModal.classList.contains('show')) {
            closeEditModal();
        }
    }

    // Trap focus inside modal when open
    function trapFocus(e) {
        if (!editSourceModal.classList.contains('show')) return;
        
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = editSourceModal;
        const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
        const focusableContent = modal.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    function openEditModal(engine, isNew = false) {
        editSourceNameInput.value = engine.name || '';
        editSourceUrlInput.value = engine.url || '';
        editSourceFaviconInput.value = engine.favicon || '';
        editSourceLogoInput.value = engine.textLogo || '';
        editSourceIdInput.value = engine.id; // Store ID for saving

        // Set ARIA attributes
        editSourceModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // Add event listeners
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', trapFocus);
        
        // Show modal and focus first input
        editSourceModal.classList.add('show');
        setTimeout(() => {
            editSourceNameInput.focus();
        }, 100);

        saveSourceButton.onclick = () => { // Use onclick to easily reassign for new/edit
            const updatedEngine = {
                id: editSourceIdInput.value,
                name: editSourceNameInput.value.trim() || translate('defaultSourceName'),
                url: editSourceUrlInput.value.trim(),
                favicon: editSourceFaviconInput.value.trim(),
                textLogo: editSourceLogoInput.value.trim()
            };

            if (!updatedEngine.url) {
                alert('Search URL cannot be empty.'); // Basic validation
                return;
            }

            const existingIndex = currentSearchEngines.findIndex(e => e.id === updatedEngine.id);
            if (existingIndex > -1) {
                currentSearchEngines[existingIndex] = updatedEngine;
            } else {
                currentSearchEngines.push(updatedEngine);
            }
            saveAndRerenderSources();
            closeEditModal();
        };
    }

    function closeEditModal() {
        // Set ARIA attributes
        editSourceModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        
        // Remove event listeners
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keydown', trapFocus);
        
        // Hide modal
        editSourceModal.classList.remove('show');
        
        // Return focus to the button that opened the modal
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('svg-icon-btn')) {
            activeElement.focus();
        }
    }

    // Close modal when clicking outside
    editSourceModal.addEventListener('click', (e) => {
        if (e.target === editSourceModal) {
            closeEditModal();
        }
    });

    cancelEditButton.addEventListener('click', closeEditModal);

    function deleteSearchSource(id) {
        const engine = currentSearchEngines.find(e => e.id === id);
        if (engine && confirm(`确定要删除搜索源 "${engine.name}" 吗？`)) {
            currentSearchEngines = currentSearchEngines.filter(engine => engine.id !== id);
            // If the deleted engine was the selected one, select the first one
            const currentSelected = getCurrentSearchEngine();
            if (currentSelected && currentSelected.id === id) {
                if (currentSearchEngines.length > 0) {
                    setCurrentSearchEngine(currentSearchEngines[0].id);
                }
            }
            saveAndRerenderSources();
        }
    }

    // --- Drag and Drop for Reordering Search Sources ---
    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0); // Timeout for visual feedback
    }

    function handleDragOver(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(searchSourcesList, e.clientY);
        if (afterElement == null) {
            searchSourcesList.appendChild(draggedItem);
        } else {
            searchSourcesList.insertBefore(draggedItem, afterElement);
        }
    }

    function handleDrop(e) {
        e.preventDefault(); // Prevent default drop behavior
        // The actual reordering of the array happens in handleDragEnd
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        const newOrder = [];
        searchSourcesList.querySelectorAll('.search-source-item').forEach(item => {
            const engine = currentSearchEngines.find(e => e.id === item.dataset.id);
            if (engine) newOrder.push(engine);
        });
        currentSearchEngines = newOrder;
        draggedItem = null;
        saveAndRerenderSources();
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.search-source-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Initial render of search sources
    renderSearchSources();
});
