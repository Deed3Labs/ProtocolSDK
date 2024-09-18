// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "./IValidator.sol";

/**
 * @title Validator
 * @dev Validator contract for generating token URIs and managing operating agreements.
 */
contract Validator is Initializable, OwnableUpgradeable, IValidator {
    using StringsUpgradeable for uint256;

    // Base URI for token metadata
    string private baseUri;

    // Mapping of operating agreement URIs to their names
    mapping(string => string) private operatingAgreementNames;

    // Default operating agreement URI
    string private defaultOperatingAgreementUri;

    // Events
    event BaseUriUpdated(string newBaseUri);
    event DefaultOperatingAgreementUpdated(string newUri);
    event OperatingAgreementNameUpdated(string uri, string name);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the Validator contract.
     * @param _baseUri Base URI for token metadata.
     * @param _defaultOperatingAgreementUri Default operating agreement URI.
     */
    function initialize(string memory _baseUri, string memory _defaultOperatingAgreementUri) public initializer {
        __Ownable_init();
        baseUri = _baseUri;
        defaultOperatingAgreementUri = _defaultOperatingAgreementUri;
    }

    // Public functions

    /**
     * @dev Sets the base URI for token metadata.
     * @param _newBaseUri The new base URI.
     */
    function setBaseUri(string memory _newBaseUri) public onlyOwner {
        require(bytes(_newBaseUri).length > 0, "Validator: Base URI cannot be empty");
        baseUri = _newBaseUri;
        emit BaseUriUpdated(_newBaseUri);
    }

    /**
     * @dev Returns the base URI.
     * @return The base URI string.
     */
    function getBaseUri() public view returns (string memory) {
        return baseUri;
    }

    /**
     * @dev Sets the default operating agreement URI.
     * @param _uri The new default operating agreement URI.
     */
    function setDefaultOperatingAgreement(string memory _uri) public onlyOwner {
        require(bytes(_uri).length > 0, "Validator: URI cannot be empty");
        defaultOperatingAgreementUri = _uri;
        emit DefaultOperatingAgreementUpdated(_uri);
    }

    /**
     * @dev Returns the default operating agreement URI.
     * @return The default operating agreement URI.
     */
    function defaultOperatingAgreement() external view override returns (string memory) {
        return defaultOperatingAgreementUri;
    }

    /**
     * @dev Adds or updates the name for a given operating agreement URI.
     * @param _uri The URI of the operating agreement.
     * @param _name The name to associate with the URI.
     */
    function setOperatingAgreementName(string memory _uri, string memory _name) public onlyOwner {
        require(bytes(_uri).length > 0, "Validator: URI cannot be empty");
        require(bytes(_name).length > 0, "Validator: Name cannot be empty");
        operatingAgreementNames[_uri] = _name;
        emit OperatingAgreementNameUpdated(_uri, _name);
    }

    /**
     * @dev Removes the name associated with an operating agreement URI.
     * @param _uri The URI to remove.
     */
    function removeOperatingAgreementName(string memory _uri) public onlyOwner {
        require(bytes(operatingAgreementNames[_uri]).length > 0, "Validator: URI does not exist");
        delete operatingAgreementNames[_uri];
        emit OperatingAgreementNameUpdated(_uri, "");
    }

    /**
     * @dev Returns the name associated with an operating agreement URI.
     * @param _uri The URI of the operating agreement.
     * @return The name string.
     */
    function operatingAgreementName(string memory _uri) external view override returns (string memory) {
        return operatingAgreementNames[_uri];
    }

    /**
     * @dev Returns the token URI for a given token ID.
     * @param tokenId The ID of the token.
     * @return The token URI string.
     */
    function tokenURI(uint256 tokenId) external view override returns (string memory) {
        require(bytes(baseUri).length > 0, "Validator: Base URI is not set");
        return string(abi.encodePacked(baseUri, tokenId.toString()));
    }
}

