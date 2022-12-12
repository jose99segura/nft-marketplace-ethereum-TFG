
//Vamos a preparar un test para el mint del token
const NftMarket = artifacts.require("NftMarket");
const { ethers } = require("ethers");

contract("NftMarket", accounts => {
    let _contract = null;
    let _nftPrice = ethers.utils.parseEther("0.3").toString();
    let _listingPrice = ethers.utils.parseEther("0.025").toString();

    before( async () =>{
        _contract = await NftMarket.deployed();
    })

    describe("Mint token", () => {
        const tokenURI = "https://test.com";
        before( async () => {
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: accounts[0],
                value: _listingPrice
            })
        })

        // 1º TEST, Comprobar si la cuenta owner coincide
        it("owner of first token should be adress[0]", async () => {
            const owner = await _contract.ownerOf(1);
            assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
        })

        // 2º TEST, Comprobar si el tokenURI coincide
        it("first token should point to the correct tokenURI", async () => {
            const actualTokenURI = await _contract.tokenURI(1);
            assert.equal(actualTokenURI, tokenURI, "tokenURI is not matching");
        })

        // 3º TEST, Comprobar que no se pueda mintear token, con tokenURI ya usado
        it("should not be possible to create a NFT with used tokenURI", async () => {
            try {
                await _contract.mintToken(tokenURI, _nftPrice, {
                    from: accounts[0],
                })
            } catch (error) {
                assert(error, "NFT was minted with previously used tokenURI");
            }
        })

        // 4º TEST, Comprobar cuantos items tenemos listados
        it("Should have one listed item", async () => {
            const listedItemCount = await _contract.liesteItemsCount();
            assert.equal(listedItemCount.toNumber(), 1, "Listed items count is not 1");
        })

        // 5º TEST, Comprobar si se ha creado item NFT
        it("Should have created NFT item", async () => {
            const nftItem = await _contract.getNftItem(1);
            assert.equal(nftItem.tokenId, 1, "Token id is not 1");
            assert.equal(nftItem.price, _nftPrice, "Nft Price is not correct");
            assert.equal(nftItem.creator, accounts[0], "Creator not correct");
            assert.equal(nftItem.isListed, true, "Token is not listed");
        })

    })
})