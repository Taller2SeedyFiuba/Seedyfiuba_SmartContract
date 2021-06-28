import { ethers, waffle, getNamedAccounts, deployments } from "hardhat";
import { Wallet, Transaction, BigNumberish, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { MockProvider } from "ethereum-waffle";
import { Seedifyuba } from "../typechain";
const { loadFixture } = waffle;

export async function fixtureDeployedSeedifyuba(): Promise<Seedifyuba> {
  await deployments.fixture();
  const { deployer } = await getNamedAccounts();
  const seedifyuba = <unknown>await ethers.getContract("Seedifyuba", deployer);
  return seedifyuba as Seedifyuba;
}

export function fixtureProjectCreatedBuilder(stagesCost: BigNumberish[]) {
  return async function fixtureProjectCreated(
    _w: Wallet[],
    _p: MockProvider,
  ): Promise<{
    projectCreationTx: Transaction;
    seedifyuba: Seedifyuba;
    deployer: SignerWithAddress;
    projectOwner: SignerWithAddress;
    pr1: SignerWithAddress;
    pr2: SignerWithAddress;
    pr3: SignerWithAddress;
    aFunder: SignerWithAddress;
    anotherFunder: SignerWithAddress;
    projectId: BigNumberish;
  }> {
    const [deployer, projectOwner, pr1, pr2, pr3, aFunder, anotherFunder] = await ethers.getSigners();
    const seedifyuba = await loadFixture(fixtureDeployedSeedifyuba);
    const projectId = await seedifyuba.nextId();
    const projectCreationTx = <Transaction>await seedifyuba.createProject(stagesCost, projectOwner.address);
    return {
      projectCreationTx,
      seedifyuba,
      deployer,
      projectOwner,
      aFunder,
      anotherFunder,
      projectId,
      pr1,
      pr2,
      pr3,
    };
  };
}

export function fixtureProjectFundingBuilder(stagesCost: BigNumberish[]) {
  return async function fixtureProjectCreated(
    _w: Wallet[],
    _p: MockProvider,
  ): Promise<{
    projectCreationTx: Transaction;
    seedifyuba: Seedifyuba;
    deployer: SignerWithAddress;
    projectOwner: SignerWithAddress;
    pr1: SignerWithAddress;
    pr2: SignerWithAddress;
    pr3: SignerWithAddress;
    aFunder: SignerWithAddress;
    anotherFunder: SignerWithAddress;
    projectId: BigNumberish;
  }> {
    const {
      projectCreationTx,
      seedifyuba,
      aFunder,
      anotherFunder,
      deployer,
      projectOwner,
      pr1,
      pr2,
      pr3,
      projectId,
    } = await loadFixture(fixtureProjectCreatedBuilder(stagesCost));

    let seedifyubaReviwer = seedifyuba.connect(pr1);
    await seedifyubaReviwer.addReviewer(projectId);

    seedifyubaReviwer = seedifyuba.connect(pr2);
    await seedifyubaReviwer.addReviewer(projectId);

    seedifyubaReviwer = seedifyuba.connect(pr3);
    await seedifyubaReviwer.addReviewer(projectId);

    return {
      projectCreationTx,
      seedifyuba,
      deployer,
      projectOwner,
      aFunder,
      anotherFunder,
      projectId,
      pr1,
      pr2,
      pr3,
    };
  };
}

export function fixtureFundedProjectBuilder(stagesCost: BigNumberish[]) {
  return async function fixtureProjectCreated(
    _w: Wallet[],
    _p: MockProvider,
  ): Promise<{
    seedifyuba: Seedifyuba;
    deployer: SignerWithAddress;
    projectOwner: SignerWithAddress;
    pr1: SignerWithAddress;
    pr2: SignerWithAddress;
    pr3: SignerWithAddress;
    funder: SignerWithAddress;
    projectId: BigNumberish;
  }> {
    const totalCost: BigNumber = stagesCost.reduce(
      (acc: BigNumber, curr) => BigNumber.from(curr).add(acc),
      BigNumber.from(0),
    );
    const { seedifyuba, aFunder, deployer, projectOwner, pr1, pr2, pr3, projectId } = await loadFixture(
      fixtureProjectFundingBuilder(stagesCost),
    );

    const seedifyubaFunder = seedifyuba.connect(aFunder);
    await seedifyubaFunder.fund(projectId, { value: totalCost.toString() });
    return {
      seedifyuba,
      deployer,
      projectOwner,
      pr1,
      pr2,
      pr3,
      funder: aFunder,
      projectId,
    };
  };
}
