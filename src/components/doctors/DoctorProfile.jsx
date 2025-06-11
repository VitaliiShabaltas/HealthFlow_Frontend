import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doctor from '../../assets/doctor.png';
import commentatorIcon from '../../assets/icons/commentator.svg';
import { getReviewsByDoctor } from '../../api/reviews';
import { useProfileHandlers } from '../../utils/useProfileHandlers';
export function DoctorProfile({
  doctorId,
  name,
  email,
  phone,
  experienceSince,
  specialization,
  roomNumber,
  rating,
  onProfileUpdated,
}) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [editableName, setEditableName] = useState(name);
  const [isEditingLogin, setIsEditingLogin] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editableEmail, setEditableEmail] = useState(email);
  const [editablePhone, setEditablePhone] = useState(phone);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState({ text: '', type: '' });
  const [personalMessage, setPersonalMessage] = useState({
    text: '',
    type: '',
  });
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
    email,
    phone,
    editableBirthDate: null,
    setEditableBirthDate: () => {},
  });
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByDoctor(doctorId);
        setReviews(data);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (doctorId) {
      fetchReviews();
    }
  }, [doctorId]);

  return (
    <div>
      <div className="flex gap-15 items-start pb-8 ">
        <div className="flex flex-col items-center w-[160px]">
          <img
            src={doctor}
            alt="Doctor Avatar"
            className="w-[160px] h-[170px] rounded-full mb-2"
          />
          <p className="text-sm text-gray-700 font-medium mb-1">
            Рейтинг: {rating}
          </p>
          <div className="text-lg flex drop-shadow">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 shadow-sm rounded-xl border border-gray-300 overflow-hidden">
          <div className="flex justify-between border-b border-gray-400 py-2 pl-4">
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

          <div className="divide-y divide-gray-200 text-left">
            <div className="flex px-4 py-2 text-sm ">
              <span className="w-2/4 text-gray-600">Повне ім'я</span>

              <span className="text-blue-700 w-3/4 font-medium">
                {isEditingPersonal ? (
                  <input
                    type="name"
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                  />
                ) : (
                  name || 'Не вказано'
                )}
              </span>
            </div>
            <div className="flex px-4 py-2 text-sm">
              <div className="w-2/5 text-gray-600">Спеціальність</div>
              <div className="text-blue-700 font-medium">{specialization}</div>
            </div>
            <div className="flex px-4 py-2 text-sm">
              <div className="w-2/5 text-gray-600">Стаж в роках:</div>
              <div className="text-blue-700 font-medium">{experienceSince}</div>
            </div>
            <div className="flex px-4 py-2 text-sm">
              <div className="w-2/5 text-gray-600">Кабінет</div>
              <div className="text-blue-700 font-medium">{roomNumber}</div>
            </div>
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
      </div>

      <div className="border border-gray-300 rounded-xl mb-4 shadow-sm">
        <div className="flex justify-between border-b border-gray-400 py-2 pl-4">
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
              email || 'Не вказано'
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
              phone || 'Не вказано'
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

      <div className="border border-gray-300 rounded-xl mb-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-gray-400 py-2 pl-4 pr-4">
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

        <div className="flex  text-gray-500 py-2 pl-4 text-start">
          <span className="w-1/4">Новий пароль</span>
          <span className="w-3/4  text-blue-600 font-semibold">
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

      <div className="space-y-4 mb-8">
        <div
          onClick={() => navigate('/schedule')}
          className="border border-gray-300 rounded-xl p-5 flex justify-between items-center cursor-pointer shadow-sm"
        >
          <span className="font-semibold text-lg">Перейти до розкладу</span>
          <span className="text-2xl">{'>'}</span>
        </div>
        <div
          onClick={() => navigate('/patients')}
          className="border border-gray-300 rounded-xl p-5 flex justify-between items-center cursor-pointer shadow-sm"
        >
          <span className="font-semibold text-lg">Пацієнти</span>
          <span className="text-2xl">{'>'}</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Відгуки ({reviews.length})</h2>

        {loadingReviews ? (
          <p>Завантаження відгуків...</p>
        ) : reviews.length === 0 ? (
          <p>Немає відгуків для цього лікаря.</p>
        ) : (
          <div className="space-y-6 text-left max-h-96 overflow-y-auto pr-2">
            {reviews.map((review, index) => (
              <div key={index} className="pb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={commentatorIcon}
                    alt="Commentator"
                    className="w-8 h-8"
                  />
                  <p className="font-semibold">
                    {`${review.client.surname} ${review.client.name}`}
                  </p>
                  <div className="text-lg flex drop-shadow">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2">{review.review}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(review.created_at).toLocaleDateString('uk-UA')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
