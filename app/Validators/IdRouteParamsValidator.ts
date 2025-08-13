import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IdRouteParamsValidator {
  constructor(protected ctx: HttpContextContract) { }

  public data = this.ctx.params

  public schema = schema.create({

    id: schema.string({}, [
      rules.uuid()
    ])
  })

  public messages: CustomMessages = {
    'id.number': 'Conversation ID must be a number',
  }
}
