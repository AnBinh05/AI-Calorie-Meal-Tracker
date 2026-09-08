import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

export const RegisterScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các thông tin');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải chứa ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await register(fullName, email, password);
    } catch (e: any) {
      Alert.alert('Đăng ký thất bại', e.message || 'Email này đã được sử dụng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>🥗 AI Calorie</Text>
            <Text style={styles.subLogo}>Bắt đầu hành trình dinh dưỡng & vóc dáng lý tưởng</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Đăng ký tài khoản</Text>
            
            <CustomInput
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChangeText={setFullName}
            />

            <CustomInput
              label="Email"
              placeholder="nhap.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <CustomInput
              label="Mật khẩu"
              placeholder="Ít nhất 6 ký tự"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <CustomButton
              title="Tạo tài khoản"
              onPress={handleRegister}
              loading={loading}
              style={{ marginTop: 16 }}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#10b981',
    letterSpacing: 0.5,
  },
  subLogo: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  linkText: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 14,
  },
});
