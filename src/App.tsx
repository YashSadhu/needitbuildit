import React, { useState } from 'react';
import { SearchAndFilter } from './components/SearchAndFilter';
import { CardModal } from './components/CardModal';
import { GroupModal } from './components/GroupModal';
import { BulkEditModal } from './components/BulkEditModal';
import { ExportModal } from './components/ExportModal';
import { ResearchNotesModal } from './components/ResearchNotesModal';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { TimelineControls } from './components/TimelineControls';
import { MainContent } from './components/MainContent';
import { Footer } from './components/Footer';
import { DataBackup } from './components/DataBackup';
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

  const handleBackToLanding = () => {
    setShowLanding(true);
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
    console.log('Import data:', data);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
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
      <Header
        viewMode={viewMode}
        selectedCards={selectedCards}
        filteredCards={filteredCards}
        groups={groups}
        onViewModeChange={setViewMode}
        onAddCard={() => setAddModalOpen(true)}
        onBulkEdit={() => setBulkEditOpen(true)}
        onExport={() => setIsExportModalOpen(true)}
        onResearchNotes={() => setIsResearchNotesOpen(true)}
        onSettings={() => setIsSettingsOpen(true)}
        onBackToLanding={handleBackToLanding}
      />

      <div className="flex-1">
        {/* Search and Filter */}
        <div className="max-w-7xl mx-auto px-6 py-8">
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
          <TimelineControls
            viewMode={viewMode}
            timelineScale={timelineScale}
            zoomLevel={zoomLevel}
            onTimelineScaleChange={setTimelineScale}
            onZoomLevelChange={setZoomLevel}
            onAddCard={() => setAddModalOpen(true)}
          />
        </div>

        {/* Main Content */}
        <MainContent
          viewMode={viewMode}
          filteredCards={filteredCards}
          groups={groups}
          zoomLevel={zoomLevel}
          timelineScale={timelineScale}
          showConcurrent={showConcurrent}
          selectedCards={selectedCards}
          onCardEdit={handleCardEdit}
          onCardDelete={deleteCard}
          onCardSelect={selectCards}
          onGroupEdit={handleGroupEdit}
          onGroupDelete={deleteGroup}
          onToggleCollapse={toggleGroupCollapse}
          onAddCard={() => setAddModalOpen(true)}
          onAddGroup={() => setGroupModalOpen(true)}
          onReorderCards={reorderCards}
          onReorderGroups={reorderGroups}
          addCardToGroup={addCardToGroup}
          getUngroupedCards={getUngroupedCards}
          onInsertCardBetween={insertCardBetween}
          onUpdateCardOrder={updateCardOrder}
        />
      </div>

      {/* Footer */}
      <Footer />

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
    </div>
  );
}

export default App;