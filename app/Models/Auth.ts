import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

export default class Auth extends BaseModel {
    public static readonly table = 'auth'

    @column({ isPrimary: true })
    public id: string

    @column()
    public clientId: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static assignUuid(auth: Auth) {
        auth.id = uuidv4()
    }
}
