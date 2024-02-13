import mongoose, { Schema } from 'mongoose'
import { RoleDocument } from '../interfaces/RoleInterface'

export const ROLES_DICT = { USER: 'user', ADMIN: 'admin' }
export const ROLES = Object.values(ROLES_DICT)

const RoleSchema = new Schema({ name: String })

const RoleModel = mongoose.model<RoleDocument>('Role', RoleSchema)

export function initRoleModel() {
    RoleModel.estimatedDocumentCount()
        .then(count => {
            if (count !== 0) return
            ROLES.map(role => {
                try {
                    new RoleModel({ name: role }).save()
                    console.log(`added ${role} to roles collection`)
                } catch (e) {
                    console.error(role, ' error ', e)
                }
            })
        })
        .catch(e => {
            console.error(e)
        })
}

export default RoleModel
