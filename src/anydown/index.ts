import { CompilerBuilder } from './compiler'
import { customCodeblock } from './custom-codeblock'
import { installRenderer } from './renderer'
import { Compiler, Middleware, MutationCommitter, Mutator, TupledMiddleware } from './types'

export default installRenderer(new CompilerBuilder().build())

export {
  Compiler,
  CompilerBuilder,
  Middleware,
  MutationCommitter,
  Mutator,
  TupledMiddleware,
  customCodeblock,
  installRenderer
}
