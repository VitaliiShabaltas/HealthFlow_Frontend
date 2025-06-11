import React from 'react';
import { Slider } from '../components/ui/Slider.jsx';
import pediatrychne from '../assets/pediatrychne.png';
import specializovane from '../assets/specializovane.png';
import terapevtychne from '../assets/terapevtychne.png';
const sliderImgs = ['../slider/1.jpg', '../slider/2.jpg', '../slider/3.jpg'];

export function MainPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative z-10">
      <section className="shadow-xl p-6">
        <Slider images={sliderImgs} />
        <h1 className="text-5xl font-bold p-6 text-center">
          <span className="text-red-600">Health</span>
          <span className="text-blue-600">Flow+</span>
        </h1>
      </section>

      <section className="relative z-8 shadow-xl pt-17 pr-30 pb-17 pl-30 min-h-[300px] flex items-center justify-center text-2xl">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-25 font-semibold">
          <li className="bg-[#84A8EE] text-white text-center rounded-4xl p-10 shadow-md">
            Онлайн-прийом та відеоконсультації
          </li>
          <li className="bg-[#84A8EE] text-white text-center rounded-4xl p-10 shadow-md">
            Зручний та великий вибір спеціалістів
          </li>
          <li className="bg-[#84A8EE] text-white text-center rounded-4xl p-10 shadow-md">
            Підтримка 24/7
          </li>
          <li className="bg-[#84A8EE] text-white text-center rounded-4xl p-10 shadow-md">
            Безпечна авторизація через Google або Facebook
          </li>
          <li className="bg-[#84A8EE] text-white text-center rounded-4xl p-10 shadow-md">
            Оплата прийому швидко та ефективно через наш застосунок
          </li>
          <li className="bg-[#84A8EE] text-white text-center rounded-4xl p-10 shadow-md">
            Можливість записатися на прийом через сайт
          </li>
        </ul>
      </section>

      <div className="bg-cover bg-center bg-no-repeat py-8 px-4 md:px-8 relative z-6 bg-white shadow-xl rounded-xl bg-[url('./src/assets/background-main.png')] mt-8">
        <section className="flex flex-col md:flex-row items-center gap-6 pb-8 pt-2 rounded-xl mt-5">
          <img
            src={terapevtychne}
            alt="Терапевтичне відділення"
            className="w-full md:w-[650px] rounded-md md:mr-8"
          />
          <div className="md:w-full text-gray-800 mt-6 md:mt-0">
            <h2 className="text-right text-3xl md:text-4xl font-bold mb-4 text-[#000000]">
              Терапевтичне відділення
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Терапевтичне відділення нашої лікарні — це місце, де пацієнти
              отримують якісну та професійну медичну допомогу у комфортних
              умовах. Ми спеціалізуємось на діагностиці та лікуванні широкого
              спектра внутрішніх захворювань, зокрема патологій
              серцево-судинної, дихальної, травної, ендокринної та сечовидільної
              систем. Наші лікарі-терапевти мають великий клінічний досвід і
              постійно вдосконалюють свої знання, щоб надавати допомогу
              відповідно до сучасних стандартів доказової медицини.
            </p>
          </div>
        </section>

        <section className="flex flex-col md:flex-row-reverse items-center gap-6 pb-8 pt-2 rounded-xl mt-5">
          <img
            src={pediatrychne}
            alt="Педіатричне відділення"
            className="w-full md:w-[650px] rounded-md"
          />
          <div className="md:w-full text-gray-800 mt-6 md:mt-0">
            <h2 className="text-left text-3xl md:text-4xl font-bold mb-4 text-[#000000]">
              Педіатричне відділення
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Педіатричне відділення нашої лікарні — це місце, де маленькі
              пацієнти отримують турботу, професійне лікування та увагу з перших
              хвилин перебування. Ми лікуємо гострі й хронічні захворювання,
              проводимо профілактичні огляди та консультації.Відділення
              обладнане сучасною технікою, зручними ліжками, ігровими зонами та
              яскравим дизайном. Працюємо разом із батьками, інформуємо та
              залучаємо до лікування, бо спільна підтримка — ключ до швидкого
              одужання.
            </p>
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-6 pb-8 pt-2 rounded-xl mt-5">
          <img
            src={specializovane}
            alt="Відділення спеціалізованої медицини"
            className="w-full md:w-[650px] rounded-md"
          />
          <div className="md:w-full text-gray-800 mt-6 md:mt-0">
            <h2 className="text-right text-2xl md:text-4xl font-bold mb-4 text-[#000000]">
              Відділення спеціалізованої медицини
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Ми дбаємо про ваше здоровя, поєднуючи досвідчених фахівців,
              сучасне обладнання та індивідуальний підхід. Напрямки:
            </p>
            <ul className="list-disc pl-6 mt-4 text-base md:text-lg text-justify space-y-2">
              <li>Неврологія</li>
              <li>Психологія та психотерапія</li>
              <li>Урологія</li>
              <li>ЛОР</li>
              <li>Офтальмологія</li>
              <li>Дерматологія</li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed text-justify mt-4">
              Створюємо комфортну атмосферу, де кожен пацієнт відчуває турботу
              та впевненість.
            </p>
          </div>
        </section>
      </div>

      <section className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 bg-[#f5f5f5] text-gray-800 pb-25 relative z-5">
        <div className="md:w-1/2 text-left pl-30 ">
          <h2 className="text-3xl font-bold mb-3">Застосунок HealthFlow+</h2>
          <ul className="list-none space-y-0 text-xl">
            <li>💡 HealthFlow+ — медицина у твоєму смартфоні</li>
            <li>🔒 Швидка авторизація</li>
            <li>🎥 Відеоконсультації з лікарем</li>
            <li>💬 Чат + голосові повідомлення</li>
            <li>⭐ Обрані лікарі</li>
            <li>📋 Історія візитів і рекомендації</li>
            <li>💳 Оплата через Monobank</li>
            <li>👏 Відгуки та оцінки</li>
            <li>📅 Автонагоди про прийоми</li>
            <li>🔗 Шейрінг у соцмережах</li>
            <li>
              Зручно. Сучасно. Для тебе. <br />
              Завантажуй HealthFlow+ вже зараз!
            </li>
          </ul>
        </div>
        <div className="md:w-1/2 text-center mt-6 md:mt-0">
          <img
            src="./src/assets/qr-code.png"
            alt="QR код для завантаження"
            className="w-80 h-80 mx-auto"
          />
          <p className="text-blue-600 underline text-lg mt-4">
            <a
              href="https://your-app-link.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Відскануй або завантажуй за посиланням
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
