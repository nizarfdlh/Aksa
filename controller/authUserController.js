const User = require('../models/user_models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const checkEmailUser = await User.findOne({
            where: {
                email,
            }
        });
        if (checkEmailUser) {
            return res.status(500).send({
                status: 'Failed',
                message: 'Email sudah digunakan'
            });
        }

        if (!name || !email || !password) {
            return res.status(500).send({
                status: 'Failed',
                message: 'Data tidak boleh kosong'
            })
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserCreate = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        })
        if (newUserCreate) {
            return res.status(202).send({
                status: 'Success',
                message: 'Registrasi berhasil!'
            })
        } else {
            return res.status(500).send({
                status: 'Failed',
                message: 'Registrasi gagal!'
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: 'Failed',
            message: 'Server internal error'
        })
    }
}

exports.signIn = async (req, res) => {
    try {
        const email = req.body.email;

        if (!email) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Email tidak boleh kosong!'
            });
        }
        
        const user = await User.findAll({
            where: {
                email: email,
            }
        });
        if (!user) {
            return res.status(400).send({
                status: 'Failed',
                message: 'User tidak ditemukan' 
            });
        }

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Password tidak sesuai, silahkan periksa kembali password yang anda masukkan!'
            });
        }

        const token = jwt.sign({ id: user[0].id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        });

        return res.cookie('token', token, {
            expires: new Date(Date.now() + 3600000),
            secure: false,
            httpOnly: true,
        })
        .status(200).send({
            message: 'Success',
            loginResult: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                token: token
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: 'Failed',
            message: 'Internal server error'
        })
    }
}

exports.signOut = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).send({
            status: 'Success',
            message: 'Logut berhasil!'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: 'Failed',
            message: 'Internal server error'
        })
    }
}