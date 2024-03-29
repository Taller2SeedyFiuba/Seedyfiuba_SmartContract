import chai from "chai";
import { waffle, ethers } from "hardhat";
import { fixtureDeployedSeedifyuba, fixtureProjectCreatedBuilder } from "./common-fixtures";
import { Seedifyuba } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { BigNumberish, Transaction, ContractTransaction } from "ethers";

const { loadFixture } = waffle;

const { expect } = chai;

describe("Seedifyuba - Creation of project", () => {
  describe("GIVEN a Seedifyuba is deployed", () => {
    const stagesCost = [15];
    describe(`WHEN a project is created with only a stage with a cost of ${stagesCost[0]}`, function () {
      let projectCreationTx: Transaction;
      let seedifyuba: Seedifyuba;
      let projectOwner: SignerWithAddress;
      let projectId: BigNumberish;
      before(async function () {
        ({ projectCreationTx, seedifyuba, projectOwner, projectId } = await loadFixture(
          fixtureProjectCreatedBuilder(stagesCost),
        ));
      });
      it("THEN an event is emited", async function () {
        return expect(await projectCreationTx)
          .to.emit(seedifyuba, "ProjectCreated")
          .withArgs(projectId, projectOwner.address, stagesCost[0]);
      });

      it(`THEN the project has a missing amount of ${stagesCost[0]}`, async function () {
        return expect((await seedifyuba.projects(projectId)).missingAmount).to.equal(stagesCost[0]);
      });

      // it(`THEN the project has the right reviewer`, async function () {
      //   return expect((await seedifyuba.projects(projectId)).reviewer).to.equal(projectReviewer.address);
      // });
      it(`THEN the project has the right owner`, async function () {
        return expect((await seedifyuba.projects(projectId)).owner).to.equal(projectOwner.address);
      });
      it(`THEN the project is at the ON_REVIEW state`, async function () {
        return expect((await seedifyuba.projects(projectId)).state).to.equal(4);
      });
    });
  });

  describe("GIVEN a Seedifyuba is deployed", () => {
    const stagesCost = [10, 20, 30000];
    const summedCost = stagesCost.reduce((acc, curr) => acc + curr);
    describe(`WHEN a project is created with three stages`, function () {
      let projectCreationTx: Transaction;
      let seedifyuba: Seedifyuba;
      let projectOwner: SignerWithAddress;
      let projectId: BigNumberish;
      before(async function () {
        ({ projectCreationTx, seedifyuba, projectOwner, projectId } = await loadFixture(
          fixtureProjectCreatedBuilder(stagesCost),
        ));
      });
      it("THEN an event is emited", async function () {
        return expect(await projectCreationTx)
          .to.emit(seedifyuba, "ProjectCreated")
          .withArgs(projectId, projectOwner.address, summedCost);
      });

      it(`THEN the project has a missing amount equal to the sum of the cost of the stages`, async function () {
        return expect((await seedifyuba.projects(projectId)).missingAmount).to.equal(summedCost);
      });
    });
  });
  describe("GIVEN a Seedifyuba is deployed", () => {
    describe("WHEN a project tries to be created by a non owner", function () {
      it("THEN th tx reverts", async function () {
        const seedifyuba = await loadFixture(fixtureDeployedSeedifyuba);
        return expect(
          seedifyuba
            .connect((await ethers.getSigners())[1])
            .createProject([10], "0x0000000000000000000000000000000000000000"),
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });
  describe("GIVEN a Seedifyuba is deployed", () => {
    describe("WHEN a project tries to be created without any stage", function () {
      it("THEN th tx reverts", async function () {
        const seedifyuba = await loadFixture(fixtureDeployedSeedifyuba);
        return expect(seedifyuba.createProject([], "0x0000000000000000000000000000000000000000")).to.be.revertedWith(
          "No stages",
        );
      });
    });
  });

  describe(`GIVEN a Seedifyiuba was created with one stage`, () => {
    describe(`WHEN a user tries to fund it`, function () {
      let tx: Promise<ContractTransaction>;
      before(async function () {
        const { seedifyuba, aFunder, projectId } = await loadFixture(fixtureProjectCreatedBuilder([10]));
        const seedifyubaFunder = seedifyuba.connect(aFunder);
        await seedifyubaFunder.projects(projectId);
        tx = seedifyubaFunder.fund(projectId, { value: 1000 });
      });
      it(`THEN tx reverts`, async function () {
        return expect(tx).to.be.revertedWith("project not in necessary state");
      });
    });
  });
});
