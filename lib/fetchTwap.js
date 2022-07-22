import 'dotenv/config';
import { ethers, BigNumber } from 'ethers';

const empAddress = process.env.EMP_ADDRESS;

function getBalance(twap, decimals = 18, fractionDigits = 14){
  const adjustedDecimals = decimals - fractionDigits;
  const divisor = BigNumber.from(10).pow(adjustedDecimals)
  const number = Number(twap.div(divisor));
  let ret = (number / 10 ** fractionDigits).toFixed(fractionDigits);
  let retToFloat = parseFloat(ret).toFixed(4);
  return retToFloat
}

const fetchTwap = async (contract, provider) => {
  console.log('fetch twap value');
  const pegAmount = '4000';
  const pegVal = ethers.utils.parseEther(pegAmount);

  const twap = await contract.twap(empAddress, pegVal);

  const twapConverted = getBalance(twap);
  return twapConverted
}

export default fetchTwap