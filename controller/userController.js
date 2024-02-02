const User = require('../models/user_models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

require('dotenv').config();

// Get Users 

exports.getUser = async (req, res) => {
    try {
        const user = await User.findAll({
            attributes: ['name', 'email'],
        });
        res.send(user);
    } catch (error) {
        res.status(401).send({
            status: 'Failed',
            message: 'Terjadi kesalahan mendapatkan user'
        })
    }
}

// Update Email User 

exports.updateEmail = async (req, res) => {
    const id = req.params.id;
    const email = req.body.email;

    try {
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        if (!user) {
            return res.status(401).send({
                status: 'Failed',
                message: 'User tidak ditemukan'
            })
        }
        await User.update({
            email: email
        }, {
            where: { id: id }
        })
        res.send({
            status: 'Success',
            message: 'Email berhasil diubah'
        })
    } catch (error) {
        console.error(error);
        return res.status(501).send({
            status: 'Failed',
            message: 'Terjadi kesalahan saat mengubah email'
        });
    }
}

// Update Password User

exports.updatePassword = async (req, res) => {
    const id = req.params.id;
    const { currentPassword, newPassword, confPassword } = req.body;

    try {
        const user = await User.findOne({
            where: { id: id }
        });
        if (!user) {
            return res.status(401).send({
                status: 'Failed',
                message: 'User tidak ditemukan'
            })
        }
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).send({
                status: 'Failed',
                message: 'Password tidak sesuai'
            });
        }
        if (newPassword !== confPassword) {
            return res.status(401).send({
                status: 'Failed',
                message: 'Password tidak sesuai, periksa kembali password yang anda masukkan!'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const hashedNewPassword = await bcrypt.hash(confPassword, salt);

        await User.update({
            password: hashedPassword,
            confPassword: hashedNewPassword
        }, {
            where: { id: id }
        })
        res.send({
            status: 'Success',
            message: 'Password berhasil diubah'
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "Failed",
            message: "Server internal error!"
        })
    }
}

exports.forgotPassword = async (req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({
            where: { email: email }
        });
        if (!user) {
            return res.status(401).send({
                status: 'Failed',
                message: 'Email tidak ditemukan'
            })
        }
        
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpired = new Date();
        otpExpired.setMinutes(otpExpired.getMinutes() + 3);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const info = await transporter.sendMail({
            from: 'aksaproject.inc@gmail.com',
            to: email,
            subject: 'Password reset OTP',
            text: `Your OTP (It is expired after 3 minute) : ${otp}`,
        })
        transporter.sendMail(info, (error, inf) => {
            if (error) {
                return res.status(400).send({
                    message: 'ERROR'
                })
            } else {
                res.json({
                    message: 'Your OTP send to the email'
                })
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: 'Failed',
            message: 'Server internal error'
        })
    }
}