import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import Message from './Message'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public sessionId: string

  @column()
  public messagesId: string

  @column()
  public lastMessages: string

  @column()
  public clientId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(conversation: Conversation) {
    conversation.id = uuidv4()
  }

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>
}
