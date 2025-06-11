export const validateFullName = (fullName) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return false;

  const [surname, name, middleName = ''] = parts;

  const nameRegex = /^[А-ЯІЇЄҐа-яіїєґA-Za-z'-]{2,}$/;

  return (
    nameRegex.test(surname) &&
    nameRegex.test(name) &&
    (middleName === '' || nameRegex.test(middleName))
  );
};
export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone) => /^\+380\d{9}$/.test(phone);

export const validatePassword = (password) => password.length >= 6;

export const validateConfirmPassword = (password, confirmPassword) =>
  password === confirmPassword;

export const validateDateOfBirth = (date) => {
  if (!date) return true;

  const selectedDate = new Date(date);
  const today = new Date();

  const minAllowedDate = new Date(
    today.getFullYear() - 16,
    today.getMonth(),
    today.getDate()
  );

  return selectedDate <= minAllowedDate;
};

export const checkEmailExists = async (email) => {
  const clientRes = await fetch(
    'https://healthflowbackend-production.up.railway.app/users/clients'
  );
  const doctorRes = await fetch(
    'https://healthflowbackend-production.up.railway.app/users/doctors'
  );

  if (!clientRes.ok || !doctorRes.ok) {
    throw new Error('Не вдалося перевірити email');
  }

  const clients = await clientRes.json();
  const doctors = await doctorRes.json();

  const clientExists = clients.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  const doctorExists = doctors.some(
    (doc) => doc.user.email.toLowerCase() === email.toLowerCase()
  );

  return clientExists || doctorExists;
};
