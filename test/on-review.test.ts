import chai from "chai";
import { waffle } from "hardhat";
import { fixtureProjectCreatedBuilder } from "./common-fixtures";
import { Seedifyuba } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { BigNumberish, ContractTransaction } from "ethers";

const { loadFixture } = waffle;

const { expect } = chai;

describe("Seedifyuba - Creation of project", () => {
  describe("GIVEN a Seedifyuba is deployed", () => {
    describe(`WHEN a project is created`, function () {
      let seedifyuba: Seedifyuba;
      let projectOwner: SignerWithAddress;
      let projectId: BigNumberish;
      let pr1: SignerWithAddress;
      let pr2: SignerWithAddress;
      let pr3: SignerWithAddress;
      let tx: ContractTransaction;

      before(async function () {
        ({ projectOwner, seedifyuba, projectId, pr1, pr2, pr3 } = await loadFixture(
          fixtureProjectCreatedBuilder([10]),
        ));
      });
      it("THEN owner tries to review own project", async function () {
        const seedifyubaFunder = seedifyuba.connect(projectOwner);

        const tx: Promise<ContractTransaction> = seedifyubaFunder.addReviewer(projectId);

        return expect(tx).to.be.revertedWith("Owner cannot review own project");
      });

      it("THEN one reviewer is added", async function () {
        const seedifyubaFunder = seedifyuba.connect(pr1);

        tx = await seedifyubaFunder.addReviewer(projectId);
        return expect(await tx)
          .to.emit(seedifyuba, "ReviwerAdded")
          .withArgs(projectId, pr1.address);
      });

      it(`THEN the project is still in on_review state`, async function () {
        return expect((await seedifyuba.projects(projectId)).state).to.equal(4);
      });

      it(`THEN the same reviewer calls the method`, async function () {
        const seedifyubaFunder = seedifyuba.connect(pr1);

        const tx: Promise<ContractTransaction> = seedifyubaFunder.addReviewer(projectId);

        return expect(tx).to.be.revertedWith("Already reviewing this project");
      });

      it("THEN second reviewer is added", async function () {
        const seedifyubaFunder = seedifyuba.connect(pr2);

        tx = await seedifyubaFunder.addReviewer(projectId);
        return expect(await tx)
          .to.emit(seedifyuba, "ReviwerAdded")
          .withArgs(projectId, pr2.address);
      });

      it(`THEN the project is still in on_review state`, async function () {
        return expect((await seedifyuba.projects(projectId)).state).to.equal(4);
      });

      it("THEN third reviewer is added", async function () {
        const seedifyubaFunder = seedifyuba.connect(pr3);

        tx = await seedifyubaFunder.addReviewer(projectId);
        return expect(await tx)
          .to.emit(seedifyuba, "ReviwerAdded")
          .withArgs(projectId, pr3.address);
      });

      it(`THEN the project is on funding state`, async function () {
        return expect((await seedifyuba.projects(projectId)).state).to.equal(0);
      });
    });
  });
});
