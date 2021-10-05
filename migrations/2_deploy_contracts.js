const OniGear = artifacts.require("OniGear");
const OniMock = artifacts.require("OniMock");

module.exports = async() => {
  const oniGear = await OniGear.new();
  OniGear.setAsDeployed(oniGear);
  const oniMock = await OniMock.new();
  OniMock.setAsDeployed(oniMock);
};
