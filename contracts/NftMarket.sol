// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;

    //Estructura de nuestro nft
    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }
    
    uint public listingPrice = 0.025 ether;     //Precio para listar nuestro nft
    uint256[] private _allNfts;                         //Array con todos los NFTs

    Counters.Counter private _listedItems;      //Cuantos NFTs hay
    Counters.Counter private _tokenIds;

    // Mappings
    mapping( string => bool) private _usedTokenURIs;
    mapping( uint => NftItem) private _idToNftItem;
    mapping(address => mapping(uint => uint)) private _ownedTokens;
    mapping(uint => uint) private _idToOwnedIndex;
    mapping(uint => uint) private _idToNftIndex;    //Mapea el id del NFT al indice en el array que ocupa

    event NftItemCreated (
        uint tokenId,
        uint price,
        address crator,
        bool isListed
    );

    //CONSTRUCTOR
    constructor() ERC721("CreaturesNFT", "CNFT"){}

    // ------------------ FUNCIONES PUBLICAS ------------------
     function setListingPrice(uint newPrice) external onlyOwner {
        require(newPrice > 0, "Precio debe ser al menos 1 wei");
        listingPrice = newPrice;
    }

    function getNftItem( uint tokenId ) public view returns (NftItem memory) {
        return _idToNftItem[tokenId];
    }

    function listedItemsCount() public view returns (uint) {
        return _listedItems.current();
    }

    function tokenURIExists( string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

    function totalSupply() public view returns (uint) {
        return _allNfts.length;
    }

    function tokenByIndex(uint index) public view returns (uint) {
        require(index < totalSupply(), "Index out of bounds");
        return _allNfts[index];
    }

    function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
        require(index < ERC721.balanceOf(owner), "Index out of bounds");
        return _ownedTokens[owner][index];
    }

    function getAllNftsOnSale() public view returns (NftItem[] memory) {
    uint allItemsCounts = totalSupply();
    uint currentIndex = 0;
    NftItem[] memory items = new NftItem[](_listedItems.current());

    for (uint i = 0; i < allItemsCounts; i++) {
      uint tokenId = tokenByIndex(i);
      NftItem storage item = _idToNftItem[tokenId];

      if (item.isListed == true) {
        items[currentIndex] = item;
        currentIndex += 1;
      }
    }

    return items;
  }

    function getOwnedNfts() public view returns (NftItem[] memory) {
        uint ownedItemsCount = ERC721.balanceOf(msg.sender);
        NftItem[] memory items = new NftItem[](ownedItemsCount);

        for (uint i = 0; i < ownedItemsCount; i++) {
            uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
            NftItem storage item = _idToNftItem[tokenId];
            items[i] = item;
        }

        return items;
    }

    function burnToken(uint tokenId) public {
        _burn(tokenId);
    }

    function mintToken(string memory tokenURI, uint price) public payable returns (uint){   
        //tokenURI es el link al metadata, pinata en nuestro caso --> https://pinata.com/metadata
        //msg.sender es la dirección de nuestra cartera de metamask
        require(!tokenURIExists(tokenURI), "Token URI ya existe");
        require(msg.value == listingPrice, "El precio debe ser igual al precio de listado");

        _tokenIds.increment();
        _listedItems.increment();

        uint newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);      
        _setTokenURI(newTokenId, tokenURI);
        _createNftItem(newTokenId, price);
        _usedTokenURIs[tokenURI] = true;

        return newTokenId;
    }

    // Funcion para comprar el nft
    function buyNft( uint tokenId ) public payable {
        uint price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);

        require(msg.sender != owner, "Ya posees este NFT");
        require(msg.value == price, "El precio es incorrecto");

        _idToNftItem[tokenId].isListed = false;
        _listedItems.decrement();
        // Transferir el token desde el owner hacia el que interactua con el programa
        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);

    }

    function placeNftOnSale(uint tokenId, uint newPrice) public payable {
        require(ERC721.ownerOf(tokenId) == msg.sender, "No eres dueno de este NFT");
        require(_idToNftItem[tokenId].isListed == false, "Este item ya se encuentra en venta");
        require(msg.value == listingPrice, "Precio debe ser igual al precio listado");

        _idToNftItem[tokenId].isListed = true;
        _idToNftItem[tokenId].price = newPrice;
        _listedItems.increment();
    }

    // ------------------ FUNCIONES PRIVADAS ------------------
    function _createNftItem( uint tokenId, uint price ) private {
        require(price > 0, "El precio debe ser mayor que 0");
        
        //Transformamos el idToken a un NftItem con gracias al mapping y struct hechos anteriormente
        _idToNftItem[tokenId] = NftItem(
            tokenId,
            price,
            msg.sender,
            true
        );

        emit NftItemCreated(tokenId, price, msg.sender, true);  //Emitir el evento
    }

    function _beforeTokenTransfer(address from, address to, uint tokenId, uint256 nose) internal virtual override  {
        super._beforeTokenTransfer(from, to, tokenId, nose);

        // minting token
        if (from == address(0)) {
            _addTokenToAllTokensEnumaration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }

        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    function _addTokenToAllTokensEnumaration(uint tokenId) private {
        _idToNftIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }

    function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
        uint length = ERC721.balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _idToOwnedIndex[tokenId] = length;
  }

    function _removeTokenFromOwnerEnumeration(address from, uint tokenId) private {
        uint lastTokenIndex = ERC721.balanceOf(from) - 1;
        uint tokenIndex = _idToOwnedIndex[tokenId];

        if (tokenIndex != lastTokenIndex) {
        uint lastTokenId = _ownedTokens[from][lastTokenIndex];

        _ownedTokens[from][tokenIndex] = lastTokenId;
        _idToOwnedIndex[lastTokenId] = tokenIndex;
        }

        delete _idToOwnedIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
        uint lastTokenIndex = _allNfts.length - 1;
        uint tokenIndex = _idToNftIndex[tokenId];
        uint lastTokenId = _allNfts[lastTokenIndex];

        _allNfts[tokenIndex] = lastTokenId;
        _idToNftIndex[lastTokenId] = tokenIndex;

        delete _idToNftIndex[tokenId];
        _allNfts.pop();
    }
    
}