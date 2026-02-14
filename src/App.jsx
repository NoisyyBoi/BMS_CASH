import { useState, useEffect } from 'react';
import { categories, getMaterialsByCategory, getMaterialById, getUnitOptions } from './data/materials';
import { getSavedLists, saveList, deleteList, getUsedSiteNames, formatListForSharing, shareViaWhatsApp, copyToClipboard, generatePDF, getTodayFormatted } from './utils/storage';

// View constants
const VIEWS = {
  HOME: 'home',
  PROJECT: 'project',
  CATEGORIES: 'categories',
  ITEMS: 'items',
  REVIEW: 'review',
  HISTORY: 'history',
};

function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [siteName, setSiteName] = useState('');
  const [projectDate, setProjectDate] = useState(getTodayFormatted());
  const [savedLists, setSavedLists] = useState([]);
  const [toast, setToast] = useState(null);
  const [showSiteSelector, setShowSiteSelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // New states
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState(null);
  const [numpadMaterial, setNumpadMaterial] = useState(null);
  const [numpadValue, setNumpadValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQty, setCustomItemQty] = useState('');

  useEffect(() => {
    setSavedLists(getSavedLists());
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const startNewList = () => {
    setSelectedItems({});
    setSiteName('');
    setProjectDate(getTodayFormatted());
    setView(VIEWS.PROJECT);
  };

  const continueToCategories = () => {
    setView(VIEWS.CATEGORIES);
  };

  const openCategory = (categoryId) => {
    setCurrentCategory(categoryId);
    setSearchQuery('');
    setSizeFilter(null);
    setView(VIEWS.ITEMS);
  };

  const updateQuantity = (materialId, delta) => {
    setSelectedItems(prev => {
      const current = prev[materialId]?.quantity || 0;
      const newQty = Math.max(0, current + delta);
      
      if (newQty === 0) {
        const { [materialId]: _, ...rest } = prev;
        return rest;
      }
      
      const material = getMaterialById(materialId);
      const existingUnit = prev[materialId]?.unit || material.unit;
      
      return {
        ...prev,
        [materialId]: {
          id: materialId,
          name: material.name,
          nameKannada: material.nameKannada,
          unit: existingUnit,
          unitType: material.unitType,
          quantity: newQty,
          category: material.category,
        }
      };
    });
  };

  const setQuantityDirect = (materialId, qty) => {
    setSelectedItems(prev => {
      if (qty <= 0) {
        const { [materialId]: _, ...rest } = prev;
        return rest;
      }
      
      const material = getMaterialById(materialId);
      // Handle custom items (no material in database)
      if (!material) {
        return {
          ...prev,
          [materialId]: {
            ...prev[materialId],
            quantity: qty,
          }
        };
      }
      const existingUnit = prev[materialId]?.unit || material.unit;
      
      return {
        ...prev,
        [materialId]: {
          id: materialId,
          name: material.name,
          nameKannada: material.nameKannada,
          unit: existingUnit,
          unitType: material.unitType,
          quantity: qty,
          category: material.category,
        }
      };
    });
  };

  // Add a custom item
  const addCustomItem = () => {
    const name = customItemName.trim();
    const qty = parseInt(customItemQty, 10) || 1;
    if (!name) return;
    
    const id = 'custom_' + Date.now();
    setSelectedItems(prev => ({
      ...prev,
      [id]: {
        id,
        name,
        nameKannada: '',
        unit: 'Nos',
        unitType: 'default',
        quantity: qty,
        category: currentCategory || 'other',
        isCustom: true,
      }
    }));
    setCustomItemName('');
    setCustomItemQty('');
    setShowCustomItemModal(false);
    showToast('✓ Custom item added');
  };

  // Remove item from review
  const removeItem = (materialId) => {
    setSelectedItems(prev => {
      const { [materialId]: _, ...rest } = prev;
      return rest;
    });
    showToast('✓ Item removed');
  };

  const updateUnit = (materialId, newUnit) => {
    setSelectedItems(prev => {
      if (!prev[materialId]) return prev;
      return {
        ...prev,
        [materialId]: {
          ...prev[materialId],
          unit: newUnit,
        }
      };
    });
  };

  const getSelectedCount = () => Object.keys(selectedItems).length;
  
  const getCategoryItemCount = (categoryId) => {
    const categoryMaterials = getMaterialsByCategory(categoryId);
    return categoryMaterials.filter(m => selectedItems[m.id]).length;
  };

  const handleShare = () => {
    const items = Object.values(selectedItems);
    const text = formatListForSharing(items, siteName, projectDate);
    shareViaWhatsApp(text);
  };

  const handleCopy = async () => {
    const items = Object.values(selectedItems);
    const text = formatListForSharing(items, siteName, projectDate);
    const success = await copyToClipboard(text);
    if (success) {
      showToast('✓ Copied to clipboard');
    }
  };

  const handleDownloadPDF = () => {
    const items = Object.values(selectedItems);
    generatePDF(items, siteName, projectDate);
    showToast('✓ PDF downloaded');
  };

  const handleSaveList = () => {
    const items = Object.values(selectedItems);
    if (items.length === 0) return;
    
    const list = {
      siteName: siteName || 'Untitled Site',
      projectDate,
      items,
    };
    
    saveList(list);
    setSavedLists(getSavedLists());
    showToast('✓ List saved');
    setView(VIEWS.HOME);
    setSelectedItems({});
    setSiteName('');
  };

  const handleDuplicateList = (list) => {
    const itemsMap = {};
    list.items.forEach(item => {
      itemsMap[item.id] = item;
    });
    setSelectedItems(itemsMap);
    setSiteName(list.siteName + ' (Copy)');
    setProjectDate(getTodayFormatted());
    setView(VIEWS.CATEGORIES);
  };

  const handleDeleteList = (listId) => {
    setDeleteConfirmId(listId);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteList(deleteConfirmId);
      setSavedLists(getSavedLists());
      showToast('✓ Deleted');
      setDeleteConfirmId(null);
    }
  };

  const goBack = () => {
    if (view === VIEWS.ITEMS) {
      setView(VIEWS.CATEGORIES);
    } else if (view === VIEWS.CATEGORIES) {
      setView(VIEWS.PROJECT);
    } else if (view === VIEWS.PROJECT || view === VIEWS.HISTORY) {
      setView(VIEWS.HOME);
    } else if (view === VIEWS.REVIEW) {
      setView(VIEWS.CATEGORIES);
    }
  };

  // Generate date options: today first, then future 7 days, then past 7 days
  const getDateOptions = () => {
    const dates = [];
    const formatDay = (offset) => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return { label: `${day}-${month}-${year}`, offset };
    };
    // Today
    dates.push(formatDay(0));
    // Future 1–7 days
    for (let i = 1; i <= 7; i++) dates.push(formatDay(i));
    // Past 1–7 days
    for (let i = 1; i <= 7; i++) dates.push(formatDay(-i));
    return dates;
  };

  // ===== NEW: Number pad helpers =====
  const openNumpad = (materialId) => {
    const currentQty = selectedItems[materialId]?.quantity || 0;
    setNumpadMaterial(materialId);
    setNumpadValue(currentQty > 0 ? String(currentQty) : '');
  };

  const handleNumpadPress = (key) => {
    if (key === 'backspace') {
      setNumpadValue(prev => prev.slice(0, -1));
    } else if (key === 'clear') {
      setNumpadValue('');
    } else {
      // Prevent unreasonably large numbers
      if (numpadValue.length < 4) {
        setNumpadValue(prev => prev + key);
      }
    }
  };

  const handleNumpadDone = () => {
    const qty = parseInt(numpadValue, 10) || 0;
    if (numpadMaterial) {
      setQuantityDirect(numpadMaterial, qty);
    }
    setNumpadMaterial(null);
    setNumpadValue('');
  };

  // ===== NEW: Voice input (mic) =====
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input not supported on this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // English (India)
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSiteName(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      showToast('Could not recognize voice');
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // ===== NEW: Get filtered materials for items view =====
  const getFilteredMaterials = () => {
    let items = getMaterialsByCategory(currentCategory);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.nameKannada.includes(q) || 
        (m.size && m.size.toLowerCase().includes(q))
      );
    }
    
    // Apply size filter
    if (sizeFilter) {
      items = items.filter(m => m.size === sizeFilter);
    }
    
    return items;
  };

  // Get unique sizes for filter chips
  const getUniqueSizes = () => {
    const items = getMaterialsByCategory(currentCategory);
    const sizes = items.map(m => m.size).filter(Boolean);
    return [...new Set(sizes)];
  };

  // Group items by subGroup (for fittings)
  const groupBySubGroup = (items) => {
    const groups = {};
    items.forEach(item => {
      const group = item.subGroup || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  };

  // Render a single material item card
  const renderItemCard = (material) => {
    const qty = selectedItems[material.id]?.quantity || 0;
    const currentUnit = selectedItems[material.id]?.unit || material.unit;
    const unitOpts = getUnitOptions(material.unitType);
    
    return (
      <div key={material.id} className={`item-card ${qty > 0 ? 'selected' : ''}`}>
        <div className="item-info">
          <div className="item-name">{material.name}</div>
          <div className="item-name-kannada">{material.nameKannada}</div>
          <div className="item-meta">
            {material.size && <span className="item-tag">{material.size}</span>}
          </div>
        </div>
        
        {/* Unit Toggle (if available) */}
        {unitOpts && qty > 0 && (
          <div className="unit-toggle">
            {unitOpts.map(unit => (
              <button
                key={unit}
                className={`unit-btn ${currentUnit === unit ? 'active' : ''}`}
                onClick={() => updateUnit(material.id, unit)}
              >
                {unit}
              </button>
            ))}
          </div>
        )}
        
        <div className="item-controls">
          <button 
            className="qty-btn minus" 
            onClick={() => updateQuantity(material.id, -1)}
            disabled={qty === 0}
          >
            −
          </button>
          <div 
            className="qty-display tappable"
            onClick={() => openNumpad(material.id)}
          >
            {qty}
            <span className="qty-unit">{currentUnit}</span>
          </div>
          <button 
            className="qty-btn plus"
            onClick={() => updateQuantity(material.id, 1)}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Header */}
      {view !== VIEWS.HOME && (
        <header className="header">
          <div className="header-content">
            <button className="back-btn" onClick={goBack} aria-label="Go back">
              ←
            </button>
            <div>
              <h1>
                {view === VIEWS.PROJECT && 'New Project'}
                {view === VIEWS.CATEGORIES && 'Select Category'}
                {view === VIEWS.ITEMS && categories.find(c => c.id === currentCategory)?.name}
                {view === VIEWS.REVIEW && 'Review List'}
                {view === VIEWS.HISTORY && 'History'}
              </h1>
              {view === VIEWS.PROJECT && (
                <p className="header-subtitle">ಹೊಸ ಪ್ರಾಜೆಕ್ಟ್</p>
              )}
              {view === VIEWS.ITEMS && (
                <p className="header-subtitle">
                  {categories.find(c => c.id === currentCategory)?.nameKannada}
                </p>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="main-content">
        {/* Home Screen */}
        {view === VIEWS.HOME && (
          <div className="home-screen">
            <div className="home-hero">
              <div className="home-hero-icon">🔧</div>
              <h2>Pool Material List</h2>
              <p>ಪೂಲ್ ಮೆಟೀರಿಯಲ್ ಲಿಸ್ಟ್</p>
            </div>
            
            <div className="home-actions">
              <button className="btn btn-primary" onClick={startNewList}>
                <span className="btn-icon">➕</span>
                <span className="btn-content">
                  <span>New Project</span>
                  <span className="btn-kannada">ಹೊಸ ಪ್ರಾಜೆಕ್ಟ್</span>
                </span>
              </button>
              
              <button className="btn btn-secondary" onClick={() => setView(VIEWS.HISTORY)}>
                <span className="btn-icon">📋</span>
                <span className="btn-content">
                  <span>History</span>
                  <span className="btn-kannada">ಇತಿಹಾಸ</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Project Screen - Site Name & Date */}
        {view === VIEWS.PROJECT && (
          <div className="project-screen">
            <div className="project-section">
              <label className="project-label">
                <span>Site Name</span>
                <span className="project-label-kannada">ಸೈಟ್ ಹೆಸರು</span>
              </label>
              
              <div className="site-input-row">
                <button 
                  className="project-input-btn"
                  onClick={() => setShowSiteSelector(true)}
                >
                  {siteName || 'Tap to select site...'}
                </button>
                <button 
                  className={`mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={startVoiceInput}
                  aria-label="Voice input"
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
              
              {showSiteSelector && (
                <div className="modal-overlay" onClick={() => setShowSiteSelector(false)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Select Site</h3>
                      <button className="modal-close" onClick={() => setShowSiteSelector(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                      {/* Show previously used site names from saved lists */}
                      {getUsedSiteNames().length > 0 && (
                        <>
                          <div className="modal-section-label">Recent Sites</div>
                          {getUsedSiteNames().map(name => (
                            <button
                              key={name}
                              className={`modal-option ${siteName === name ? 'selected' : ''}`}
                              onClick={() => {
                                setSiteName(name);
                                setShowSiteSelector(false);
                              }}
                            >
                              {name}
                            </button>
                          ))}
                        </>
                      )}
                      <button
                        className="modal-option other"
                        onClick={() => {
                          const custom = prompt('Enter site name:');
                          if (custom) {
                            setSiteName(custom);
                          }
                          setShowSiteSelector(false);
                        }}
                      >
                        ✏️ Other / Custom
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="project-section">
              <label className="project-label">
                <span>Date</span>
                <span className="project-label-kannada">ದಿನಾಂಕ</span>
              </label>
              
              <button 
                className="project-input-btn"
                onClick={() => setShowDatePicker(true)}
              >
                📅 {projectDate}
              </button>
              
              {showDatePicker && (
                <div className="modal-overlay" onClick={() => setShowDatePicker(false)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Select Date</h3>
                      <button className="modal-close" onClick={() => setShowDatePicker(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                      {getDateOptions().map((dateObj) => (
                        <button
                          key={dateObj.label}
                          className={`modal-option ${projectDate === dateObj.label ? 'selected' : ''}`}
                          onClick={() => {
                            setProjectDate(dateObj.label);
                            setShowDatePicker(false);
                          }}
                        >
                          {dateObj.offset === 0 ? '📅 Today - ' : ''}{dateObj.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-success project-continue" onClick={continueToCategories}>
              Continue to Materials →
              <span className="btn-kannada">ಮುಂದುವರಿಸು</span>
            </button>
          </div>
        )}

        {/* Category Selection */}
        {view === VIEWS.CATEGORIES && (
          <>
            {siteName && (
              <div className="project-info-bar">
                <span>📍 {siteName}</span>
                <span>📅 {projectDate}</span>
              </div>
            )}
            
            <div className="category-grid">
              {categories.map(cat => {
                const itemCount = getCategoryItemCount(cat.id);
                return (
                  <div 
                    key={cat.id} 
                    className={`category-card ${itemCount > 0 ? 'has-items' : ''}`}
                    onClick={() => openCategory(cat.id)}
                  >
                    <div className="category-icon">{cat.icon}</div>
                    <div className="category-info">
                      <div className="category-name">{cat.name}</div>
                      <div className="category-name-kannada">{cat.nameKannada}</div>
                    </div>
                    {itemCount > 0 && (
                      <span className="category-badge">{itemCount}</span>
                    )}
                    <span className="category-arrow">›</span>
                  </div>
                );
              })}
            </div>
            
            {getSelectedCount() > 0 && (
              <div className="fab-container">
                <button className="fab" onClick={() => setView(VIEWS.REVIEW)}>
                  View List
                  <span className="fab-badge">{getSelectedCount()}</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Item Selection */}
        {view === VIEWS.ITEMS && (
          <>
            {/* Search Bar */}
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>

            {/* Size Filter Chips */}
            {getUniqueSizes().length > 1 && !searchQuery && (
              <div className="size-filters">
                <button
                  className={`size-chip ${sizeFilter === null ? 'active' : ''}`}
                  onClick={() => setSizeFilter(null)}
                >
                  All
                </button>
                {getUniqueSizes().map(size => (
                  <button
                    key={size}
                    className={`size-chip ${sizeFilter === size ? 'active' : ''}`}
                    onClick={() => setSizeFilter(sizeFilter === size ? null : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Items List (with sub-group headers for fittings) */}
            {currentCategory === 'fittings' && !searchQuery && !sizeFilter ? (
              <div className="items-list">
                {Object.entries(groupBySubGroup(getFilteredMaterials())).map(([groupName, groupItems]) => (
                  <div key={groupName}>
                    <div className="items-subgroup-header">{groupName}</div>
                    {groupItems.map(material => renderItemCard(material))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="items-list">
                {getFilteredMaterials().map(material => renderItemCard(material))}
              </div>
            )}
            
            {/* Add Custom Item Button */}
            <button 
              className="add-custom-btn"
              onClick={() => setShowCustomItemModal(true)}
            >
              ➕ Add Custom Item
            </button>

            {getSelectedCount() > 0 && (
              <div className="fab-container">
                <button className="fab" onClick={() => setView(VIEWS.REVIEW)}>
                  View List
                  <span className="fab-badge">{getSelectedCount()}</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Review Screen */}
        {view === VIEWS.REVIEW && (
          <div className="review-screen">
            {/* Project Info */}
            {(siteName || projectDate) && (
              <div className="review-project-info">
                {siteName && <div className="review-site">📍 Site: {siteName}</div>}
                <div className="review-date">📅 Date: {projectDate}</div>
              </div>
            )}
            
            <div className="review-header">
              <h2>Material List</h2>
              <span className="review-count">{getSelectedCount()} items</span>
            </div>
            
            <div className="review-list">
              {/* Group items by category */}
              {(() => {
                const items = Object.values(selectedItems);
                const grouped = {};
                items.forEach(item => {
                  const cat = item.category || (getMaterialById(item.id) ? getMaterialById(item.id).category : 'other');
                  const catInfo = categories.find(c => c.id === cat);
                  const catName = catInfo ? `${catInfo.icon} ${catInfo.name}` : '📦 Other';
                  if (!grouped[catName]) grouped[catName] = [];
                  grouped[catName].push(item);
                });
                return Object.entries(grouped).map(([catName, catItems]) => (
                  <div key={catName} className="review-category-group">
                    <div className="review-category-header">{catName}</div>
                    {catItems.map(item => (
                      <div key={item.id} className="review-item">
                        <span className="review-item-name">{item.name}</span>
                        <span 
                          className="review-item-qty tappable"
                          onClick={() => openNumpad(item.id)}
                        >
                          {item.quantity} {item.unit}
                        </span>
                        <button 
                          className="review-item-delete"
                          onClick={() => removeItem(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
            
            <div className="review-actions">
              <button className="share-btn whatsapp" onClick={handleShare}>
                📱 WhatsApp
              </button>
              <button className="share-btn pdf" onClick={handleDownloadPDF}>
                📄 Download PDF
              </button>
              <button className="share-btn copy" onClick={handleCopy}>
                📋 Copy Text
              </button>
              <button className="btn btn-success" onClick={handleSaveList}>
                💾 Save List
              </button>
            </div>
          </div>
        )}

        {/* History Screen */}
        {view === VIEWS.HISTORY && (
          <div className="history-list">
            {savedLists.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>No saved lists yet</p>
                <p>ಯಾವುದೇ ಸೇವ್ ಮಾಡಿದ ಪಟ್ಟಿಗಳಿಲ್ಲ</p>
              </div>
            ) : (
              savedLists.map(list => (
                <div key={list.id} className="history-card">
                  <div className="history-date">
                    {new Date(list.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="history-project">{list.siteName || list.projectName}</div>
                  <div className="history-summary">
                    {list.items.length} items • {list.items.slice(0, 3).map(i => i.name).join(', ')}
                    {list.items.length > 3 && '...'}
                  </div>
                  <div className="history-actions">
                    <button 
                      className="history-action-btn duplicate"
                      onClick={() => handleDuplicateList(list)}
                    >
                      📋 Duplicate
                    </button>
                    <button 
                      className="history-action-btn delete"
                      onClick={() => handleDeleteList(list.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Number Pad Modal */}
      {numpadMaterial && (
        <div className="modal-overlay" onClick={handleNumpadDone}>
          <div className="numpad-modal" onClick={e => e.stopPropagation()}>
            <div className="numpad-header">
              <span className="numpad-title">
                {getMaterialById(numpadMaterial)?.name || selectedItems[numpadMaterial]?.name || 'Item'}
              </span>
              <button className="modal-close" onClick={handleNumpadDone}>✕</button>
            </div>
            <div className="numpad-display">
              <span className="numpad-value">{numpadValue || '0'}</span>
              <span className="numpad-unit">
                {selectedItems[numpadMaterial]?.unit || getMaterialById(numpadMaterial)?.unit || 'Nos'}
              </span>
            </div>
            <div className="numpad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button 
                  key={n} 
                  className="numpad-btn"
                  onClick={() => handleNumpadPress(String(n))}
                >
                  {n}
                </button>
              ))}
              <button className="numpad-btn numpad-clear" onClick={() => handleNumpadPress('clear')}>
                C
              </button>
              <button className="numpad-btn" onClick={() => handleNumpadPress('0')}>
                0
              </button>
              <button className="numpad-btn numpad-backspace" onClick={() => handleNumpadPress('backspace')}>
                ⌫
              </button>
            </div>
            <button className="numpad-done" onClick={handleNumpadDone}>
              ✓ Done
            </button>
          </div>
        </div>
      )}

      {/* Custom Item Modal */}
      {showCustomItemModal && (
        <div className="modal-overlay" onClick={() => setShowCustomItemModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Item</h3>
              <button className="modal-close" onClick={() => setShowCustomItemModal(false)}>✕</button>
            </div>
            <div className="modal-body custom-item-form">
              <input
                type="text"
                className="custom-item-input"
                placeholder="Item name (e.g. Rubber Gasket)"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                autoFocus
              />
              <input
                type="number"
                className="custom-item-input"
                placeholder="Quantity (default: 1)"
                value={customItemQty}
                onChange={(e) => setCustomItemQty(e.target.value)}
                min="1"
              />
              <button 
                className="btn btn-primary custom-item-submit"
                onClick={addCustomItem}
                disabled={!customItemName.trim()}
              >
                ➕ Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3 className="confirm-title">Delete this list?</h3>
            <p className="confirm-text">This cannot be undone.</p>
            <div className="confirm-buttons">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
