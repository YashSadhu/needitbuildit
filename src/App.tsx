import React, { useState } from 'react';
import { PenTool, Clock, Grid3X3, List, BarChart3, Edit3, Download, FileText, Settings } from 'lucide-react';
import { SearchAndFilter } from './components/SearchAndFilter';
import { CardModal } from './components/CardModal';
import { GroupModal } from './components/GroupModal';
import { BulkEditModal } from './components/BulkEditModal';
import { ExportModal } from './components/ExportModal';
import { ResearchNotesModal } from './components/ResearchNotesModal';
import { TimelineView } from './components/TimelineView';
import { HierarchyView } from './components/HierarchyView';
import { StorageStatus } from './components/StorageStatus';
import { DataBackup } from './components/DataBackup';
import { LandingPage } from './components/LandingPage';
import { useTimelineSystem } from './hooks/useTimelineSystem';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResearchNotesOpen, setIsResearchNotesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const {
    cards,
    groups,
    metadataTemplates,
    savedSearches,
    activeFilters,
    searchTerm,
    selectedCards,
    viewMode,
    zoomLevel,
    timelineScale,
    showConcurrent,
    isAddModalOpen,
    isGroupModalOpen,
    isBulkEditOpen,
    selectedCard,
    selectedGroup,
    researchNotes,
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
    addGroup,
    updateGroup,
    deleteGroup,
    toggleGroupCollapse,
    addCardToGroup,
    removeCardFromGroup,
    reorderGroups,
    setSearchTerm,
    setActiveFilters,
    saveSearch,
    deleteSearch,
    bulkUpdateMetadata,
    selectCards,
    addTemplate,
    applyTemplate,
    setViewMode,
    setZoomLevel,
    setTimelineScale,
    setAddModalOpen,
    setGroupModalOpen,
    setBulkEditOpen,
    setSelectedCard,
    setSelectedGroup,
    getFilteredCards,
    getUniqueValues,
    getUngroupedCards,
    updateResearchNotes,
    insertCardBetween,
    updateCardOrder,
  } = useTimelineSystem();

  const filteredCards = getFilteredCards();
  const uniqueValues = getUniqueValues();

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleCardEdit = (card: any) => {
    setSelectedCard(card);
    setAddModalOpen(true);
  };

  const handleGroupEdit = (group: any) => {
    setSelectedGroup(group);
    setGroupModalOpen(true);
  };

  const handleModalSubmit = (cardData: any) => {
    if (selectedCard) {
      updateCard(selectedCard.id, cardData);
    } else {
      addCard(cardData);
    }
    setSelectedCard(null);
  };

  const handleGroupSubmit = (groupData: any) => {
    if (selectedGroup) {
      updateGroup(selectedGroup.id, groupData);
    } else {
      addGroup(groupData);
    }
    setSelectedGroup(null);
  };

  const handleModalClose = () => {
    setAddModalOpen(false);
    setSelectedCard(null);
  };

  const handleGroupModalClose = () => {
    setGroupModalOpen(false);
    setSelectedGroup(null);
  };

  const handleBulkEdit = (metadata: any) => {
    bulkUpdateMetadata(selectedCards, metadata);
    setBulkEditOpen(false);
    selectCards([]);
  };

  const handleLoadSearch = (query: any) => {
    setSearchTerm(query.text);
    setActiveFilters(query.filters);
  };

  const handleImportData = (data: any) => {
    // This would be implemented to merge or replace data
    // For now, we'll just log it
    console.log('Import data:', data);
    // You could implement specific import logic here
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Bolt Badge - Fixed Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <a 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform duration-200"
          title="Powered by Bolt"
        >
          <img 
            src="/black_circle_360x360 copy copy copy.png" 
            alt="Powered by Bolt" 
            className="w-12 h-12 drop-shadow-lg"
          />
        </a>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Story Timeline System</h1>
                <p className="text-sm text-gray-600">Comprehensive story planning and timeline management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Selector */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'timeline' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('hierarchy')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'hierarchy' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  Hierarchy
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>{filteredCards.length} cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  <span>{groups.length} groups</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Research Notes Button */}
                <button
                  onClick={() => setIsResearchNotesOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Research
                </button>

                {/* Export Button */}
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>

                {/* Settings Button */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>

              {/* Bulk Edit Button */}
              {selectedCards.length > 0 && (
                <button
                  onClick={() => setBulkEditOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit {selectedCards.length}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          activeFilters={activeFilters}
          savedSearches={savedSearches}
          uniqueValues={uniqueValues}
          onSearchChange={setSearchTerm}
          onFiltersChange={setActiveFilters}
          onSaveSearch={saveSearch}
          onLoadSearch={handleLoadSearch}
          onDeleteSearch={deleteSearch}
        />

        {/* Timeline Controls */}
        {viewMode === 'timeline' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Scale:</label>
                  <select
                    value={timelineScale}
                    onChange={(e) => setTimelineScale(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Zoom:</label>
                  <button
                    onClick={() => setZoomLevel(zoomLevel - 0.25)}
                    disabled={zoomLevel <= 0.5}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(zoomLevel + 0.25)}
                    disabled={zoomLevel >= 3}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <PenTool className="w-4 h-4" />
                Add Card
              </button>
            </div>
          </div>
        )}

        {/* Main View */}
        {viewMode === 'timeline' ? (
          <TimelineView
            cards={filteredCards}
            groups={groups}
            zoomLevel={zoomLevel}
            timelineScale={timelineScale}
            showConcurrent={showConcurrent}
            onCardEdit={handleCardEdit}
            onCardDelete={deleteCard}
            onCardSelect={selectCards}
            selectedCards={selectedCards}
            onReorderCards={reorderCards}
            onInsertCardBetween={insertCardBetween}
            onUpdateCardOrder={updateCardOrder}
          />
        ) : (
          <HierarchyView
            cards={filteredCards}
            groups={groups}
            onCardEdit={handleCardEdit}
            onCardDelete={deleteCard}
            onGroupEdit={handleGroupEdit}
            onGroupDelete={deleteGroup}
            onToggleCollapse={toggleGroupCollapse}
            onAddCard={() => setAddModalOpen(true)}
            onAddGroup={() => setGroupModalOpen(true)}
            selectedCards={selectedCards}
            onCardSelect={selectCards}
            onReorderCards={reorderCards}
            onReorderGroups={reorderGroups}
            addCardToGroup={addCardToGroup}
            getUngroupedCards={getUngroupedCards}
            onInsertCardBetween={insertCardBetween}
            onUpdateCardOrder={updateCardOrder}
          />
        )}

        {/* Modals */}
        <CardModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          editCard={selectedCard}
          templates={metadataTemplates}
          groups={groups}
        />

        <GroupModal
          isOpen={isGroupModalOpen}
          onClose={handleGroupModalClose}
          onSubmit={handleGroupSubmit}
          editGroup={selectedGroup}
        />

        <BulkEditModal
          isOpen={isBulkEditOpen}
          onClose={() => setBulkEditOpen(false)}
          onApply={handleBulkEdit}
          selectedCount={selectedCards.length}
          templates={metadataTemplates}
        />

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          cards={cards}
          groups={groups}
        />

        <ResearchNotesModal
          isOpen={isResearchNotesOpen}
          onClose={() => setIsResearchNotesOpen(false)}
          notes={researchNotes}
          onUpdateNotes={updateResearchNotes}
        />

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  Settings & Data Management
                </h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <DataBackup
                  cards={cards}
                  groups={groups}
                  researchNotes={researchNotes}
                  metadataTemplates={metadataTemplates}
                  savedSearches={savedSearches}
                  onImportData={handleImportData}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;