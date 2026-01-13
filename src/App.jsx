import { useState, useEffect } from 'react';
import { categories, getMaterialsByCategory, getMaterialById, getUnitOptions, siteNames } from './data/materials';
import { getSavedLists, saveList, deleteList, formatListForSharing, shareViaWhatsApp, copyToClipboard, generatePDF, getTodayFormatted } from './utils/storage';

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
        }
      };
    });
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
    deleteList(listId);
    setSavedLists(getSavedLists());
    showToast('✓ Deleted');
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

  // Generate date options for picker (today and past 7 days)
  const getDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 8; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      dates.push(`${day}-${month}-${year}`);
    }
    return dates;
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
              
              <button 
                className="project-input-btn"
                onClick={() => setShowSiteSelector(true)}
              >
                {siteName || 'Tap to select site...'}
              </button>
              
              {showSiteSelector && (
                <div className="modal-overlay" onClick={() => setShowSiteSelector(false)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Select Site</h3>
                      <button className="modal-close" onClick={() => setShowSiteSelector(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                      {siteNames.map(name => (
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
                      {getDateOptions().map((date, index) => (
                        <button
                          key={date}
                          className={`modal-option ${projectDate === date ? 'selected' : ''}`}
                          onClick={() => {
                            setProjectDate(date);
                            setShowDatePicker(false);
                          }}
                        >
                          {index === 0 ? '📅 Today - ' : ''}{date}
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
            <div className="items-list">
              {getMaterialsByCategory(currentCategory).map(material => {
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
                      <div className="qty-display">
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
              {Object.values(selectedItems).map(item => (
                <div key={item.id} className="review-item">
                  <span className="review-item-name">{item.name}</span>
                  <span className="review-item-qty">{item.quantity} {item.unit}</span>
                </div>
              ))}
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

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
