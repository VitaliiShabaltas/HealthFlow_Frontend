import { getIdFromJWT, getJWT } from './jwt';
import { updateProfile } from '../api/profile';
import {
  validateDateOfBirth,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
  checkEmailExists,
} from '../api/validation';

export function useProfileHandlers({
  editableName,
  setEditableName,
  editableBirthDate,
  setEditableBirthDate,
  editableEmail,
  setEditableEmail,
  editablePhone,
  setEditablePhone,
  newPassword,
  setNewPassword,
  setPersonalMessage,
  setLoginMessage,
  setPasswordMessage,
  setIsEditingPersonal,
  setIsEditingLogin,
  setIsEditingPassword,
  onProfileUpdated,
  name,
  birthDate,
  email,
  phone,
}) {
  const handleSavePersonal = async () => {
    setPersonalMessage({ text: '', type: '' });

    const id = getIdFromJWT();
    const token = getJWT();

    const [surname, namePart, middleName] = editableName.trim().split(' ');

    if (!validateFullName(editableName)) {
      setPersonalMessage({
        text: 'Будь ласка, введіть принаймні прізвище та імʼя.',
        type: 'error',
      });
      return;
    }

    if (!validateDateOfBirth(editableBirthDate)) {
      setPersonalMessage({
        text: 'Потрібно бути старше 16.',
        type: 'error',
      });
      return;
    }

    try {
      await updateProfile(id, token, {
        surname,
        name: namePart,
        middlename: middleName || '',
        date_of_birth: editableBirthDate || null,
        email: editableEmail || null,
        password: newPassword || null,
      });

      setPersonalMessage({
        text: 'Персональні дані успішно збережено.',
        type: 'success',
      });

      if (onProfileUpdated) await onProfileUpdated();
      setIsEditingPersonal(false);
    } catch (err) {
      setPersonalMessage({
        text: 'Помилка збереження персональних даних.',
        type: 'error',
      });
      console.error(err);
    }
  };

  const handleSaveLogin = async () => {
    setLoginMessage({ text: '', type: '' });

    const id = getIdFromJWT();
    const token = getJWT();

    const trimmedEmail = editableEmail?.trim();
    const trimmedPhone = editablePhone?.trim();

    if (trimmedEmail && !validateEmail(trimmedEmail)) {
      setLoginMessage({
        text: 'Будь ласка, введіть коректну електронну адресу.',
        type: 'error',
      });
      return;
    }

    if (trimmedPhone && !validatePhone(trimmedPhone)) {
      setLoginMessage({
        text: 'Будь ласка, введіть номер телефону у форматі +380000000000.',
        type: 'error',
      });
      return;
    }
    if (trimmedEmail) {
      const emailInUse = await checkEmailExists(trimmedEmail);
      if (emailInUse && trimmedEmail !== email) {
        setLoginMessage({
          text: 'Цей email вже використовується.',
          type: 'error',
        });
        return;
      }
    }
    try {
      await updateProfile(id, token, {
        email: trimmedEmail || null,
        phone: trimmedPhone || null,
      });

      setLoginMessage({
        text: 'Дані для входу успішно збережено.',
        type: 'success',
      });

      if (onProfileUpdated) await onProfileUpdated();
      setIsEditingLogin(false);
    } catch (err) {
      setLoginMessage({
        text: 'Помилка збереження даних для входу.',
        type: 'error',
      });
      console.error(err);
    }
  };

  const handleSavePassword = async () => {
    setPasswordMessage({ text: '', type: '' });

    const id = getIdFromJWT();
    const token = getJWT();

    if (!validatePassword(newPassword)) {
      setPasswordMessage({
        text: 'Пароль має містити щонайменше 6 символів.',
        type: 'error',
      });
      return;
    }

    try {
      await updateProfile(id, token, {
        password: newPassword,
      });

      setPasswordMessage({
        text: 'Пароль успішно оновлено.',
        type: 'success',
      });

      if (onProfileUpdated) await onProfileUpdated();
      setIsEditingPassword(false);
      setNewPassword('');
    } catch (err) {
      setPasswordMessage({
        text: 'Помилка зміни пароля.',
        type: 'error',
      });
      console.error(err);
    }
  };

  const handleCancelPersonal = () => {
    setEditableName(name);
    setEditableBirthDate(birthDate);
    setIsEditingPersonal(false);
    setPersonalMessage({ text: '', type: '' });
  };

  const handleCancelLogin = () => {
    setEditableEmail(email);
    setEditablePhone(phone);
    setIsEditingLogin(false);
    setLoginMessage({ text: '', type: '' });
  };

  const handleCancelPassword = () => {
    setNewPassword('');
    setIsEditingPassword(false);
    setPasswordMessage({ text: '', type: '' });
  };

  return {
    handleSavePersonal,
    handleSaveLogin,
    handleSavePassword,
    handleCancelPersonal,
    handleCancelLogin,
    handleCancelPassword,
  };
}
