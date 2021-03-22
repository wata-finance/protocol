import { task } from "hardhat/config"
import { setHRE } from "../../helps/utils"

task("set-HRE", "set global hre").setAction(async (_, _HRE) => {
	setHRE(_HRE)
	return _HRE
})
