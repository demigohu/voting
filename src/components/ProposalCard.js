import React from 'react';

const ProposalCard = ({
  proposal,
  selectedProposal,
  selectedOption,
  setSelectedOption,
  handleVote,
  handleCloseVoting,
  handleProposalClick,
  isVoting,
}) => {
  return (
    <div
      key={proposal.id}
      style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}
      onClick={() => handleProposalClick(proposal)}
    >
      <h2>{proposal.description}</h2>
      <p>Opsi: {proposal.options.join(', ')}</p>

      {proposal.isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSelectedOption(e.target.value);
            handleVote();
          }}
        >
          <label>
            Pilih Opsi:
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {proposal.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={isVoting}>
            {isVoting ? 'Voting...' : 'Vote'}
          </button>
        </form>
      )}

      <p>Pembuat Proposal: {proposal.creator}</p>

      <>
        <p>Hasil Voting:</p>
        <ul>
          {/* ... */}
        </ul>
      </>

      {proposal.creator && (
        <button
          onClick={() => {
            handleCloseVoting();
          }}
          disabled={isVoting}
        >
          {isVoting ? 'Menutup...' : 'Tutup Voting'}
        </button>
      )}

      <p>Status Voting: {proposal.isOpen ? 'Masih Dibuka' : 'Sudah Ditutup'}</p>
    </div>
  );
};

export default ProposalCard;