// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

    // Struct untuk menyimpan informasi proposal
    struct Proposal {
        string description;
        string[] options;
        mapping(string => uint256) votes;
        mapping(address => bool) hasVoted;
        bool isOpen;
        address creator; // Tambahkan alamat pembuat proposal
    }

    // Array untuk menyimpan daftar proposal
    Proposal[] public proposals;

    // Event untuk memberi tahu ketika proposal dibuat
    event ProposalCreated(uint256 proposalId, string description, string[] options, address creator);

    // Event untuk memberi tahu ketika suara masuk
    event Voted(uint256 proposalId, address voter, string option);

    // Modifikasi untuk memastikan hanya admin yang dapat melakukan beberapa operasi
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this operation");
        _;
    }

    // Modifikasi untuk memastikan pemilih belum memilih pada proposal tertentu
    modifier hasNotVoted(uint256 proposalId) {
        require(!proposals[proposalId].hasVoted[msg.sender], "You have already voted for this proposal");
        _;
    }

    // Konstruktor contract, dijalankan saat kontrak dibuat
    constructor() {
        admin = msg.sender;
    }

    // Fungsi untuk membuat proposal baru
    function createProposal(string memory _description, string[] memory _options) external {
        require(_options.length > 1, "Proposal must have at least two options");

        Proposal storage newProposal = proposals.push();
        newProposal.description = _description;
        newProposal.options = _options;
        newProposal.isOpen = true;
        newProposal.creator = msg.sender; // Setel pembuat proposal

        emit ProposalCreated(proposals.length - 1, _description, _options, msg.sender);
    }

    // Fungsi untuk memberikan suara pada proposal tertentu
    function vote(uint256 proposalId, string memory option) external hasNotVoted(proposalId) {
        require(proposalId < proposals.length, "Invalid proposal ID");
        require(proposals[proposalId].isOpen, "Voting for this proposal is closed");
        require(validateOption(proposals[proposalId].options, option), "Invalid option");

        proposals[proposalId].votes[option]++;
        proposals[proposalId].hasVoted[msg.sender] = true;

        emit Voted(proposalId, msg.sender, option);
    }

    // Fungsi untuk menutup voting pada proposal tertentu oleh pemilik proposal
    function closeVoting(uint256 proposalId) external {
        require(proposalId < proposals.length, "Invalid proposal ID");
        require(msg.sender == proposals[proposalId].creator, "Only the creator can close the proposal");

        proposals[proposalId].isOpen = false;
    }

    // Fungsi untuk mendapatkan informasi suatu proposal
    function getProposal(uint256 proposalId) external view returns (string memory description, string[] memory options, bool isOpen, address creator) {
        require(proposalId < proposals.length, "Invalid proposal ID");

        Proposal storage proposal = proposals[proposalId];  // Menggunakan storage
        return (proposal.description, proposal.options, proposal.isOpen, proposal.creator);
    }

    // Fungsi untuk mendapatkan hasil voting suatu proposal
    function getVotingResults(uint256 proposalId) external view returns (string[] memory options, uint256[] memory votes) {
        require(proposalId < proposals.length, "Invalid proposal ID");

        Proposal storage proposal = proposals[proposalId];
        uint256 numOptions = proposal.options.length;

        string[] memory resultOptions = new string[](numOptions);
        uint256[] memory resultVotes = new uint256[](numOptions);

        for (uint256 i = 0; i < numOptions; i++) {
            resultOptions[i] = proposal.options[i];
            resultVotes[i] = proposal.votes[proposal.options[i]];
        }

        return (resultOptions, resultVotes);
    }

    function getProposalsLength() external view returns (uint256) {
    return proposals.length;
    }


    // Fungsi internal untuk memvalidasi opsi suara
    function validateOption(string[] memory options, string memory option) internal pure returns (bool) {
        for (uint256 i = 0; i < options.length; i++) {
            if (keccak256(bytes(options[i])) == keccak256(bytes(option))) {
                return true;
            }
        }
        return false;
    }
}
