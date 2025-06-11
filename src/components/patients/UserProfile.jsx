import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { uk } from 'date-fns/locale';
import { useProfileHandlers } from '../../utils/useProfileHandlers';
import alertCircle from '../../assets/icons/alertCircle.svg';
import chat from '../../assets/icons/chat.svg';
import video from '../../assets/icons/videoChat.svg';
export function UserProfile({
  name,
  birthDate,
  email,
  phone,
  handleLogout,
  onProfileUpdated,
  onOpenChat,
  scheduledDoctors,
}) {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingLogin, setIsEditingLogin] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [editableName, setEditableName] = useState(name);
  const [editableBirthDate, setEditableBirthDate] = useState(birthDate);
  const [editableEmail, setEditableEmail] = useState(email);
  const [editablePhone, setEditablePhone] = useState(phone);
  const [newPassword, setNewPassword] = useState('');

  const [personalMessage, setPersonalMessage] = useState({
    text: '',
    type: '',
  });
  const [loginMessage, setLoginMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({
    text: '',
    type: '',
  });
  const {
    handleSavePersonal,
    handleSaveLogin,
    handleSavePassword,
    handleCancelPersonal,
    handleCancelLogin,
    handleCancelPassword,
  } = useProfileHandlers({
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
  });
  return (
    <div>
      <div className="border border-gray-500 rounded-xl mb-4 shadow-sm">
        <div className="flex justify-between border-b border-gray-500 py-2 pl-4">
          <h2 className="font-semibold text-gray-800 text-start">
            Персональні дані
          </h2>
          <div className="flex gap-4">
            {isEditingPersonal && (
              <span
                onClick={handleCancelPersonal}
                className="text-red-600 hover:border-red-600 border-transparent border-b font-semibold cursor-pointer"
              >
                Скасувати
              </span>
            )}
            <span
              className="font-semibold mr-3 hover:border-gray-800 border-transparent border-b cursor-pointer"
              onClick={async () => {
                if (isEditingPersonal) {
                  await handleSavePersonal();
                } else {
                  setIsEditingPersonal(true);
                }
              }}
            >
              {isEditingPersonal ? 'Зберегти' : 'Внести зміни'}
            </span>
          </div>
        </div>

        <div className="flex text-gray-500 py-2 pl-4 border-b border-gray-300 text-start">
          <span className="w-1/4">Повне ім'я</span>
          <span className="w-3/4 text-blue-600 font-semibold">
            {isEditingPersonal ? (
              <input
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
              />
            ) : (
              editableName || 'Не вказано'
            )}
          </span>
        </div>
        <div className="flex text-gray-500 py-2 pl-4 text-start">
          <span className="w-1/4">Дата народження</span>
          <span className="w-3/4 text-blue-600 font-semibold">
            {isEditingPersonal ? (
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={editableBirthDate?.split('T')[0] || ''}
                onChange={(e) => setEditableBirthDate(e.target.value)}
              />
            ) : editableBirthDate ? (
              format(new Date(editableBirthDate), 'dd.MM.yyyy', { locale: uk })
            ) : (
              'Не вказано'
            )}
          </span>
        </div>

        {personalMessage.text && (
          <p
            className={`mt-2 ml-4 text-sm ${
              personalMessage.type === 'success'
                ? 'text-blue-600'
                : 'text-red-600'
            }`}
          >
            {personalMessage.text}
          </p>
        )}
      </div>
      <div className="border border-gray-500 rounded-xl mb-4 shadow-sm">
        <div className="flex justify-between border-b border-gray-500 py-2 pl-4">
          <h2 className="font-semibold text-gray-800 text-start">
            Дані для входу в систему
          </h2>
          <div className="flex gap-4">
            {isEditingLogin && (
              <span
                onClick={handleCancelLogin}
                className="text-red-600 hover:border-red-600 border-transparent border-b font-semibold cursor-pointer"
              >
                Скасувати
              </span>
            )}
            <span
              className="font-semibold mr-3 hover:border-gray-800 border-transparent border-b cursor-pointer"
              onClick={async () => {
                if (isEditingLogin) {
                  await handleSaveLogin();
                } else {
                  setIsEditingLogin(true);
                }
              }}
            >
              {isEditingLogin ? 'Зберегти' : 'Внести зміни'}
            </span>
          </div>
        </div>

        <div className="flex text-gray-500 py-2 pl-4 border-b border-gray-300 text-start">
          <span className="w-1/4">Електронна пошта</span>
          <span className="w-3/4 text-blue-600 font-semibold">
            {isEditingLogin ? (
              <input
                type="email"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={editableEmail}
                onChange={(e) => setEditableEmail(e.target.value)}
              />
            ) : (
              editableEmail || 'Не вказано'
            )}
          </span>
        </div>
        <div className="flex text-gray-500 py-2 pl-4 text-start">
          <span className="w-1/4">Номер телефону</span>
          <span className="w-3/4 text-blue-600 font-semibold">
            {isEditingLogin ? (
              <input
                type="tel"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={editablePhone}
                onChange={(e) => setEditablePhone(e.target.value)}
              />
            ) : (
              editablePhone || 'Не вказано'
            )}
          </span>
        </div>

        {loginMessage.text && (
          <p
            className={`mt-2 ml-4 text-sm ${
              loginMessage.type === 'success' ? 'text-blue-600' : 'text-red-600'
            }`}
          >
            {loginMessage.text}
          </p>
        )}
      </div>
      <div className="border border-gray-500 rounded-xl mb-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-gray-500 py-2 pl-4 pr-4">
          <h2 className="font-semibold text-gray-800">Зміна пароля</h2>
          <div className="flex gap-4">
            {isEditingPassword && (
              <span
                onClick={handleCancelPassword}
                className="text-red-600 hover:border-red-600 border-transparent border-b font-semibold cursor-pointer"
              >
                Скасувати
              </span>
            )}
            <span
              onClick={async () => {
                if (isEditingPassword) await handleSavePassword();
                else setIsEditingPassword(true);
              }}
              className="font-semibold cursor-pointer hover:underline"
            >
              {isEditingPassword ? 'Зберегти' : 'Змінити'}
            </span>
          </div>
        </div>

        <div className="flex text-gray-500 py-2 pl-4 text-start">
          <span className="w-1/4">Новий пароль</span>
          <span className="w-3/4 text-blue-600 font-semibold">
            {isEditingPassword ? (
              <input
                type="password"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            ) : (
              '******'
            )}
          </span>
        </div>

        {passwordMessage.text && (
          <p
            className={`mt-2 ml-4 text-sm ${
              passwordMessage.type === 'success'
                ? 'text-blue-600'
                : 'text-red-600'
            }`}
          >
            {passwordMessage.text}
          </p>
        )}
      </div>

      <div className="border border-gray-500 rounded-xl mb-4 shadow-sm">
        <h2 className="font-semibold text-gray-800 border-b border-gray-500 py-2 pl-4">
          Лікарі до яких записані на прийом
        </h2>

        {scheduledDoctors && scheduledDoctors.length > 0 ? (
          scheduledDoctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className="flex text-gray-500 py-2 pl-4 border-b border-gray-300 text-start"
            >
              <span className="w-1/4">{index + 1}</span>
              <span className="w-2/4 text-blue-600 font-semibold">
                {doctor.fullName}
              </span>
              <div className="flex gap-3 items-center justify-end w-1/4 mr-6">
                <img
                  className="w-8 h-8 cursor-pointer"
                  src={video}
                  alt="Відеодзвінок"
                  onClick={() =>
                    window.open(
                      'https://meet.google.com/qqg-uyvn-fog',
                      '_blank'
                    )
                  }
                />
                <img
                  className="w-7 h-7 cursor-pointer"
                  src={chat}
                  alt="Чат"
                  onClick={() => onOpenChat(doctor.fullName)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="py-2 px-4 text-gray-400">Немає запланованих прийомів</p>
        )}
      </div>
      <div className="flex items-center gap-4 mt-12">
        <img src={alertCircle} alt="" className="w-8 h-8" />
        <span className="text-blue-600 font-semibold">
          Зауважте! Щоб побачити інформацію про ваші прийоми завантажте та
          увійдіть у додаток за цим посиланням...
        </span>
      </div>
    </div>
  );
}
