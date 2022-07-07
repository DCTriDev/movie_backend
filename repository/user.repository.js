const bcrypt = require('bcryptjs')
const {PrismaClient} = require('@prisma/client')
const {insertUserSchema} = require('../query/user.query')
const {generateToken} = require('../helper/jwt.helper')
const prisma = new PrismaClient()

const getAllUser = async () => {
    return await prisma.user.findMany()
}

const insertUser = async (input) => {
    const {username, password, fullName, email, phoneNumber, birthday} = input
    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)

    try {
        await prisma.user.create(
            insertUserSchema(username, hashPassword, fullName, email, phoneNumber, birthday)
        )
        return {
            username: username,
            password: password,
            roleName: 'USER',
        }
    } catch (e) {
        return {
            status: 'error',
            message: e,
        }
    }
}

const login = async (input) => {
    const {username, password} = input
    try {
        const userInfo = await prisma.$queryRaw`
            SELECT username, password, "fullName", email, "phoneNumber", "roleName" FROM "User" as U
            JOIN "UserRole" as UR ON UR."userId" = U."id"
            JOIN "Role" as R ON UR."roleId" = R."id"
            JOIN "Profile" as P ON P."userId" = U."id"
            WHERE U."username" = ${username.toLowerCase()}
        `
        console.log(userInfo[0])
        if (userInfo.length !== 0) {
            const isSuccess = bcrypt.compareSync(password, userInfo[0].password)
            if (isSuccess) {
                const accessToken = generateToken(userInfo[0])
                return {
                    ...userInfo[0],
                    accessToken,
                }
            } else {
                // Promise.reject(Error('Password is incorrect'))
                throw new Error('Password is incorrect. Please try again.')
            }
        } else {
            throw new Error('Username is not exist. Please sign up first or try again.')
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports = {
    getAllUser,
    insertUser,
    login,
}
