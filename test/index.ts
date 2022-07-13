import { expect } from "chai";
import { ethers, network } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

interface Signers {
  admin: SignerWithAddress;
  user: SignerWithAddress;
}

describe("NFT Tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user = signers[1];
    this.signers.artist = signers[2];

    this.baseUrl0 = "test base url 0";
    this.transformedUrl0 = "test transformed url 0";
    this.baseUrl1 = "test base url 1";
    this.transformedUrl1 = "test transformed url 1";
    this.baseUrlID = "https://test.com/{id}";
    this.url0 = "0.jpg";
    this.url1 = "1.jpg";
  });

  it("Animagus", async function () {
    const Animagus = await ethers.getContractFactory("Animagus");
    const animagus = await Animagus.deploy(
      this.signers.artist.address,
      1
    );
    await animagus.deployed();

    // mint
    await animagus.mintTo(this.signers.user.address, this.baseUrl0, this.transformedUrl0);
    expect(await animagus.ownerOf(0)).to.equal(this.signers.user.address);
    expect(await animagus.totalSupply()).to.equal(1);
    await animagus.mintTo(this.signers.admin.address, this.baseUrl1, this.transformedUrl1);

    // view URI
    expect(await animagus.tokenURI(0)).to.equal(this.baseUrl0);
    expect(await animagus.tokenURI(1)).to.equal(this.baseUrl1);
    await network.provider.send("evm_increaseTime", [45200]);
    await network.provider.send("evm_mine");
    expect(await animagus.tokenURI(0)).to.equal(this.transformedUrl0);
    expect(await animagus.tokenURI(1)).to.equal(this.transformedUrl1);
    await network.provider.send("evm_increaseTime", [45200]);
    await network.provider.send("evm_mine");
    expect(await animagus.tokenURI(0)).to.equal(this.baseUrl0);
    expect(await animagus.tokenURI(1)).to.equal(this.baseUrl1);

    // transfer
    await animagus.connect(this.signers.user).transferFrom(this.signers.user.address, this.signers.artist.address, 0);
    expect(await animagus.ownerOf(0)).to.equal(this.signers.artist.address);
    expect(await animagus.balanceOf(this.signers.user.address)).to.equal(0);
    expect(await animagus.balanceOf(this.signers.artist.address)).to.equal(1);

    // burn
    await animagus.connect(this.signers.artist).burn(0);
    expect(await animagus.totalSupply()).to.equal(1);
    expect(await animagus.balanceOf(this.signers.artist.address)).to.equal(0);
  });

  it("Heirloom", async function () {
    const Heirloom = await ethers.getContractFactory("Heirloom");
    const heirloom = await Heirloom.deploy(
      this.baseUrlID,
    );
    await heirloom.deployed();

    // mint
    await heirloom.mint(this.signers.user.address, 0, 1, "0x00");
    expect(await heirloom.balanceOf(this.signers.user.address, 0)).to.equal(1);
    expect(await heirloom.totalSupply(0)).to.equal(1);

    // view URI
    expect(await heirloom.uri(0)).to.equal(this.baseUrlID);

    // transfer
    await heirloom.connect(this.signers.user).safeTransferFrom(this.signers.user.address, this.signers.artist.address, 0, 1, "0x00");
    expect(await heirloom.balanceOf(this.signers.user.address, 0)).to.equal(0);
    expect(await heirloom.balanceOf(this.signers.artist.address, 0)).to.equal(1);

    // burn
    await heirloom.connect(this.signers.artist).burn(this.signers.artist.address, 0, 1);
    expect(await heirloom.totalSupply(0)).to.equal(0);
    expect(await heirloom.balanceOf(this.signers.artist.address, 0)).to.equal(0);
  });
});
