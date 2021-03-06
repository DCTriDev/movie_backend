const {PrismaClient} = require('@prisma/client')
const {decodeToken} = require('../helper/jwt.helper')
const APIError = require('../helper/api.helper')
const prisma = new PrismaClient()

const getAllProfile = async () => {
    return await prisma.profile.findMany()
}

const getUserProfile = async (input, accessToken) => {
    const {username} = input
    try {
        const isValidToken = decodeToken(accessToken)
        if (isValidToken.status) {
            const userInfo = await prisma.$queryRaw`
                SELECT username, "fullName", avatar, email, "phoneNumber", "birthday", gender FROM "User" as U
                JOIN "Profile" as P ON P."userId" = U."id"
                JOIN "Gender" as G ON G."id" = P."genderId"
                WHERE U."username" = ${username.toLowerCase()}
            `
            if (userInfo.length !== 0) {
                return {
                    ...userInfo[0],
                }
            } else {
                throw new APIError({
                    status: 404,
                    message: 'Username could not be found. Please sign up first or try again!',
                })
            }
        } else {
            throw new APIError({status: 403, message: isValidToken.message})
        }
    } catch (error) {
        return error
    }
}

const updateProfile = async (input) => {
    try {
        return await prisma.profile.update({
            where: {
                id: input.id,
            },
            data: {
                fullName: input.fullName,
                email: input.email,
                phoneNumber: input.phoneNumber,
                birthday: input.birthday,
            },
        })
    } catch (e) {
        return null
    }
}

module.exports = {
    getAllProfile,
    getUserProfile,
    updateProfile,
}
