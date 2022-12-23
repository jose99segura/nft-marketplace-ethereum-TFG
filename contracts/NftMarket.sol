// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage{
    using Counters for Counters.Counter;

    //Estructura de nuestro nft
    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }
    
    uint public listingPrice = 0.025 ether;     //Precio para listar nuestro nft

    Counters.Counter private _listedItems;      //Cuantos NFTs hay
    Counters.Counter private _tokenIds;

    mapping( string => bool) private _usedTokenURIs;
    mapping( uint => NftItem) private _idToNftItem;

    event NftItemCreated (
        uint tokenId,
        uint price,
        address crator,
        bool isListed
    );

    //CONSTRUCTOR
    constructor() ERC721("CreaturesNFT", "CNFT"){}

    // ------------------ FUNCIONES PUBLICAS ------------------
    function getNftItem( uint tokenId ) public view returns (NftItem memory) {
        return _idToNftItem[tokenId];
    }

    function listedItemsCount() public view returns (uint) {
        return _listedItems.current();
    }

    function tokenURIExists( string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

    function mintToken(string memory tokenURI, uint price) public payable returns (uint){   
        //tokenURI es el link al metadata, pinata en nuestro caso --> https://pinata.com/metadata
        //msg.sender es la dirección de nuestra cartera de metamask
        require(!tokenURIExists(tokenURI), "Token URI already exists");
        require(msg.value == listingPrice, "Price must be equal to listing price");

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
    
}