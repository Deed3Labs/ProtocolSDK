// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

/**
 * @title IValidator
 * @dev Interface for Validator contracts used with DeedNFT.
 */
interface IValidator {
    /**
     * @dev Returns the token URI for a given token ID.
     * @param tokenId ID of the token.
     * @return URI string.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);

    /**
     * @dev Returns the default operating agreement URI.
     * @return URI string.
     */
    function defaultOperatingAgreement() external view returns (string memory);

    /**
     * @dev Returns the name associated with an operating agreement URI.
     * @param uri_ URI of the operating agreement.
     * @return Name string.
     */
    function operatingAgreementName(string memory uri_)
        external
        view
        returns (string memory);
}
