import Function from './functions.utils'
import Asset from 'imports/assets.import'
import CommonComponent from 'imports/components.import'
import * as Constant from './constant.utils'
import Model from 'imports/models.import'
import * as validation from './validation.utils'
// import Interface from 'interfaces/common.interface'

const imports = {
  Functions: Function,
  Assets: Asset,
  Components: CommonComponent,
  Constants: Constant,
  Models: Model,
  validation: validation
  // Types: Interface,
}

export const Functions = Function
export const Assets = Asset
export const Component = CommonComponent
export const Constants = Constant
export const Models = Model
export const Validation = validation
// export const Types = Interface

export default imports