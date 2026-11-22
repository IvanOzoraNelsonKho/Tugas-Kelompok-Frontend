import type { Bi } from "../../lib/data";

export interface QuizQuestion {
  question: Bi;
  options: Bi[];
  answer: number;
}

export const defaultQuestions: QuizQuestion[] = [
  {
    question: {
      id: "Apa kepanjangan dari Batagor?",
      en: "What does Batagor stand for?",
    },
    options: [
      {
        id: "Bakso Tahu Goreng",
        en: "Fried Tofu Fish Balls",
      },
      {
        id: "Bakwan Tahu Goreng",
        en: "Fried Tofu Fritters",
      },
      {
        id: "Bakar Tahu Goreng",
        en: "Grilled Fried Tofu",
      },
      {
        id: "Baso Tahu Gurih",
        en: "Savory Tofu Meatballs",
      },
    ],
    answer: 0,
  },
  {
    question: {
      id: "Batagor berasal dari kota mana?",
      en: "Which city did Batagor originate in?",
    },
    options: [
      {
        id: "Bandung",
        en: "Bandung",
      },
      {
        id: "Surabaya",
        en: "Surabaya",
      },
      {
        id: "Yogyakarta",
        en: "Yogyakarta",
      },
      {
        id: "Medan",
        en: "Medan",
      },
    ],
    answer: 0,
  },
  {
    question: {
      id: "Ikan apa yang umum digunakan untuk adonan Batagor klasik?",
      en: "Which fish is commonly used in classic Batagor filling?",
    },
    options: [
      {
        id: "Ikan tuna",
        en: "Tuna",
      },
      {
        id: "Ikan tenggiri",
        en: "Mackerel",
      },
      {
        id: "Ikan lele",
        en: "Catfish",
      },
      {
        id: "Ikan bandeng",
        en: "Milkfish",
      },
    ],
    answer: 1,
  },
  {
    question: {
      id: "Saus apa yang biasanya disajikan bersama Batagor?",
      en: "Which sauce is usually served with Batagor?",
    },
    options: [
      {
        id: "Saus tomat",
        en: "Tomato sauce",
      },
      {
        id: "Saus keju",
        en: "Cheese sauce",
      },
      {
        id: "Saus kacang",
        en: "Peanut sauce",
      },
      {
        id: "Saus kari",
        en: "Curry sauce",
      },
    ],
    answer: 2,
  },
  {
    question: {
      id: "Sekitar kapan Batagor mulai muncul di Bandung?",
      en: "Around when did Batagor first appear in Bandung?",
    },
    options: [
      {
        id: "Akhir 1960-an",
        en: "Late 1960s",
      },
      {
        id: "Akhir 1970-an",
        en: "Late 1970s",
      },
      {
        id: "Akhir 1980-an",
        en: "Late 1980s",
      },
      {
        id: "Akhir 1990-an",
        en: "Late 1990s",
      },
    ],
    answer: 1,
  },
  {
    question: {
      id: "Tepung apa yang umumnya digunakan sebagai bahan pengikat adonan Batagor agar kenyal?",
      en: "Which flour is commonly used as a binder in Batagor dough for a chewy texture?",
    },
    options: [
      { id: "Tepung beras", en: "Rice flour" },
      { id: "Tepung tapioka / sagu", en: "Tapioca / Sago flour" },
      { id: "Tepung jagung (maizena)", en: "Cornstarch" },
      { id: "Tepung terigu", en: "Wheat flour" },
    ],
    answer: 1,
  },
  {
    question: {
      id: "Selain tahu, kulit apa yang sering digunakan untuk membungkus adonan Batagor goreng?",
      en: "Besides tofu, what wrapper is commonly used for fried Batagor?",
    },
    options: [
      { id: "Kulit lumpia", en: "Spring roll skin" },
      { id: "Kulit risoles", en: "Rissole skin" },
      { id: "Kulit pangsit", en: "Wonton skin" },
      { id: "Kulit kebab", en: "Tortilla wrap" },
    ],
    answer: 2,
  },
  {
    question: {
      id: "Perasan jeruk apa yang paling sering ditambahkan ke atas bumbu kacang Batagor agar segar?",
      en: "Which citrus juice is commonly squeezed over Batagor peanut sauce for freshness?",
    },
    options: [
      { id: "Jeruk limau", en: "Key lime" },
      { id: "Jeruk bali", en: "Pomelo" },
      { id: "Jeruk keprok", en: "Tangerine" },
      { id: "Jeruk manis", en: "Sweet orange" },
    ],
    answer: 0,
  },
  {
    question: {
      id: "Siapa nama penjual yang dikenal luas sebagai salah satu pelopor Batagor di Bandung?",
      en: "Who is widely known as one of the pioneers of Batagor in Bandung?",
    },
    options: [
      { id: "Haji Isan", en: "Haji Isan" },
      { id: "Haji Mamat", en: "Haji Mamat" },
      { id: "Mang Ujang", en: "Mang Ujang" },
      { id: "Pak Joko", en: "Pak Joko" },
    ],
    answer: 0,
  },
  {
    question: {
      id: "Varian Batagor apa yang disajikan bersama kuah kaldu hangat gurih?",
      en: "Which Batagor variant is served with warm savory broth?",
    },
    options: [
      { id: "Batagor Kering", en: "Dry Batagor" },
      { id: "Batagor Kuah", en: "Soupy Batagor" },
      { id: "Batagor Bakar", en: "Grilled Batagor" },
      { id: "Batagor Crispy", en: "Crispy Batagor" },
    ],
    answer: 1,
  },
];
