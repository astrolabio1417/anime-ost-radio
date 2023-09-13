import mongoose, { Schema } from 'mongoose'

type IRole = {
    name: string
}

export const ROLES = ['user', 'admin']

const RoleModel = mongoose.model(
    'Role',
    new Schema<IRole>({
        name: String,
    }),
)

export function initRoleModel() {
    RoleModel.estimatedDocumentCount()
        .then(count => {
            if (count !== 0) return
            ROLES.map(role => {
                try {
                    new RoleModel({
                        name: role,
                    }).save()
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
