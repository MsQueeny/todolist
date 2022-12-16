import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'

import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const EditProfile = () => {
    const navigation = useNavigation()
    const [username, setUsername] = useState('')
    const [nama, setNama] = useState('')
    const [password, setPassword] = useState('')
    const [passwordBaru, setPasswordBaru] = useState('')
    const [konfirmasi, setKonfirmasi] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(true)
    const [newPasswordVisible, setNewPasswordVisible] = useState(true)
    const [konfirmasiVisible, setKonfirmasiVisible] = useState(true)

    const [data, setData] = useState({
        username: '',
        password: '',
    })

    useEffect(() => {
        getData()
        return () => { }
    }, [])

    const getData = async () => {
        try {
            const username = await AsyncStorage.getItem('username')
            const password = await AsyncStorage.getItem('password')

            if (username !== null) {
                setData({
                    username: username,
                    password: password
                })
            }
        } catch (e) {
            // error reading value
        }
    }

    const resetPassword = async (value) => {
        console.log('value', value)

        try {
            const response = await axios.put('http://192.168.69.74:3200/users', {
                username: data.username,
                nama: value.nama,
                password: data.password,
                passwordBaru: value.passwordBaru,
            })

            if (response.data.status == 200) {
                console.log('response', response.data)
                await AsyncStorage.removeItem('nama')
                await AsyncStorage.removeItem('password')

                await AsyncStorage.setItem('nama', value.nama)
                await AsyncStorage.setItem('password', value.passwordBaru)

                navigation.replace('Homepage')
                ToastAndroid.show("Password berhasil diubah", ToastAndroid.SHORT)
            }
        } catch (error) {
            console.log(error.message)
            ToastAndroid.show("Cek kembali username dan password", ToastAndroid.SHORT)
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ marginTop: 25, marginLeft: 24 }}
                onPress={() => navigation.goBack()}
            >
                <Icon name='arrow-left' color={'#fff'} size={24} />
            </TouchableOpacity>

            <Text style={styles.txt_basic}>
                Basic Information
                <Text style={{ color: '#ED5341' }}>*</Text>
            </Text>

            <Text style={styles.label}>Username</Text>
            <View style={styles.center}>
                <TextInput
                    style={[styles.input]}
                    placeholder='Enter your Username'
                    placeholderTextColor='#fff'
                    onChangeText={(username) => setUsername(username)}
                    value={data.username}
                />
            </View>

            <Text style={styles.label}>Nama</Text>
            <View style={styles.center}>
                <TextInput
                    style={[styles.input]}
                    placeholder='Enter your Name'
                    placeholderTextColor='#fff'
                    onChangeText={(nama) => setNama(nama)}
                    value={nama}
                />
            </View>

            <Text style={styles.label}>Password Lama</Text>
            <View style={[styles.center, { flexDirection: 'row' }]}>
                <TextInput
                    style={[styles.input, { marginHorizontal: -13 }]}
                    placeholder='Enter your password'
                    placeholderTextColor='#fff'
                    secureTextEntry={passwordVisible}
                    onChangeText={(password) => setPassword(password)}
                    value={data.password}
                />

                <TouchableOpacity style={{ marginLeft: -20, marginTop: -25 }}>
                    <Icon
                        name={passwordVisible ? 'eye-off' : 'eye'} color='#fff' size={20}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Password Baru</Text>
            <View style={[styles.center, { flexDirection: 'row' }]}>
                <TextInput
                    style={[styles.input, { marginHorizontal: -13 }]}
                    placeholder='Enter your new password'
                    placeholderTextColor='#fff'
                    secureTextEntry={newPasswordVisible}
                    onChangeText={(passwordBaru) => setPasswordBaru(passwordBaru)}
                    value={passwordBaru}
                />

                <TouchableOpacity style={{ marginLeft: -20, marginTop: -25 }}>
                    <Icon
                        name={newPasswordVisible ? 'eye-off' : 'eye'} color='#fff' size={20}
                        onPress={() => setNewPasswordVisible(!newPasswordVisible)}
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Konfirmasi Password</Text>
            <View style={[styles.center, { flexDirection: 'row' }]}>
                <TextInput
                    style={[styles.input, { marginHorizontal: -13 }]}
                    placeholder='Enter your password'
                    placeholderTextColor='#fff'
                    secureTextEntry={konfirmasiVisible}
                    onChangeText={(konfirmasi) => setKonfirmasi(konfirmasi)}
                    value={konfirmasi}
                />

                <TouchableOpacity style={{ marginLeft: -20, marginTop: -25 }}>
                    <Icon
                        name={konfirmasiVisible ? 'eye-off' : 'eye'} color='#fff' size={20}
                        onPress={() => setKonfirmasiVisible(!konfirmasiVisible)}
                    />
                </TouchableOpacity>
            </View>

            <View style={[styles.container1, styles.center]}>
                <TouchableOpacity
                    style={[styles.btn_tambah, styles.center]}
                    onPress={
                        async () => {
                            await resetPassword({ username, nama, password, passwordBaru })
                        }
                    }
                >
                    <Text style={styles.txt_tambah}>Change Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },

    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    txt_basic: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '400',
        fontStyle: 'normal',
        fontFamily: 'Roboto',
        marginLeft: 24,
        marginTop: 25,
        marginBottom: 25,
    },

    label: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        fontFamily: 'Roboto',
        marginLeft: 24,
        marginBottom: 4,
    },

    input: {
        borderColor: '#8875FF',
        color: '#fff',
        width: 312,
        height: 40,
        paddingHorizontal: 15,
        borderWidth: 2,
        borderRadius: 4,
        marginBottom: 25,
    },

    container1: {
        backgroundColor: '#363636',
        width: '100%',
        elevation: 4,
        bottom: 0,
        position: 'absolute',
    },

    btn_tambah: {
        backgroundColor: '#8875FF',
        width: 312,
        height: 40,
        marginTop: 16,
        marginBottom: 12,
        borderRadius: 4,
    },

    txt_tambah: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'normal',
        fontFamily: 'Roboto',
    },
})

export default EditProfile