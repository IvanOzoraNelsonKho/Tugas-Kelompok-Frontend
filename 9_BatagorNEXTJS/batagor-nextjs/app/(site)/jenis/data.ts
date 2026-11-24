import type { Bi } from "../../lib/data";

export interface Variant {
  img: string;
  w: number;
  h: number;
  alt: string;
  title: Bi;
  text: Bi;
  detail: Bi;
}

export interface FeaturedVariant {
  badge: Bi;
  title: Bi;
  text: Bi;
  detail: Bi;
  img: string;
  w: number;
  h: number;
  alt: string;
}

// Varian Utama dibuat array agar mudah menambah kartu baru (cukup tambah objek di dalam array ini)
export const featuredVariants: FeaturedVariant[] = [
  {
    badge: { id: "Varian Utama", en: "Main Variant" },
    title: { id: "Batagor Goreng (Original)", en: "Fried Batagor (Original)" },
    text: {
      id: "Versi paling klasik dengan tahu, pangsit, dan siomay ikan goreng renyah yang disiram saus kacang kental.",
      en: "The classic version with crispy fried tofu, wonton, and fish dumplings topped with thick peanut sauce.",
    },
    detail: {
      id: "Versi paling klasik dan paling banyak dicari. Tahu, kulit pangsit, dan siomay ikan digoreng kering hingga renyah keemasan, lalu disiram saus kacang kental dan kecap manis. Biasanya disantap dengan tambahan perasan jeruk limau dan sambal.",
      en: "The most classic and popular version. Tofu, wonton skin, and fish dumplings are deep-fried until golden and crispy, then topped with thick peanut sauce and sweet soy sauce, usually finished with a squeeze of lime and chili sauce.",
    },
    img: "/images/batagor-original.jpeg",
    w: 520,
    h: 367,
    alt: "Batagor Goreng Klasik",
  },
];

// Fallback untuk menjaga kompatibilitas jika ada file lain yang memanggil featuredVariant tunggal
export const featuredVariant: FeaturedVariant = featuredVariants[0];

export const variants: Variant[] = [
  {
    img: "/images/kuah.jpeg",
    w: 736,
    h: 736,
    alt: "Batagor Kuah",
    title: { id: "Batagor Kuah", en: "Batagor Kuah (Soupy)" },
    text: {
      id: "Disajikan dalam kuah kaldu hangat berbumbu, mirip mi kocok. Cocok dinikmati saat cuaca dingin.",
      en: "Served in a warm, seasoned savory broth, similar to mi kocok. Perfect for cold weather.",
    },
    detail: {
      id: "Disajikan dalam mangkuk berisi kuah kaldu hangat berbumbu gurih, mirip dengan mi kocok khas Bandung. Tekstur luar batagor yang renyah perlahan menyerap kuah sehingga menjadi lembut di mulut, lengkap dengan taburan daun bawang, seledri, dan bawang goreng. Sangat cocok dinikmati saat cuaca dingin atau hujan.",
      en: "Served in a bowl of warm, savory seasoned broth, reminiscent of Bandung's famous mi kocok. The crispy exterior slowly absorbs the broth for a tender bite, garnished with scallions, celery, and fried shallots. A comforting choice that is perfect for cold or rainy weather.",
    },
  },
  {
    img: "/images/bakar.jpeg",
    w: 459,
    h: 459,
    alt: "Batagor Bakar",
    title: { id: "Batagor Bakar", en: "Grilled Batagor" },
    text: {
      id: "Alternatif yang lebih rendah minyak, dipanggang di atas bara hingga sedikit gosong dan beraroma smoky.",
      en: "A lower-oil alternative, grilled over charcoal until slightly charred with a smoky aroma.",
    },
    detail: {
      id: "Alternatif batagor yang lebih rendah minyak karena dimasak dengan cara dipanggang di atas bara api hingga permukaannya sedikit gosong kecokelatan. Proses pembakaran ini menghadirkan aroma smoky yang khas dan menggugah selera. Biasanya disajikan dengan olesan bumbu kacang manis, kecap, dan sambal pedas.",
      en: "A lower-oil alternative cooked by grilling over charcoal until the surface is slightly charred and golden brown. This grilling process creates a distinctive, appetizing smoky aroma. It is typically served brushed with sweet peanut sauce, sweet soy sauce, and spicy chili.",
    },
  },
  {
    img: "/images/puyuh.jpeg",
    w: 648,
    h: 486,
    alt: "Batagor Telur Puyuh",
    title: { id: "Batagor Isi Telur Puyuh", en: "Batagor with Quail Egg" },
    text: {
      id: "Diberi tambahan telur puyuh di dalam adonan untuk tekstur dan rasa yang lebih kaya.",
      en: "Filled with an added quail egg for a richer texture and flavor.",
    },
    detail: {
      id: "Inovasi batagor yang menyembunyikan sebutir telur puyuh rebus di dalam balutan adonan ikan tenggiri dan tahu sebelum digoreng hingga keemasan. Perpaduan renyahnya kulit luar, gurihnya adonan ikan, dan lembutnya telur puyuh di bagian tengah memberikan tekstur serta cita rasa yang jauh lebih kaya dan mengenyangkan.",
      en: "A creative twist that hides a whole boiled quail egg inside the mackerel fish and tofu batter before deep-frying to golden perfection. The combination of the crispy outer layer, savory fish paste, and creamy quail egg center delivers a much richer and more filling taste.",
    },
  },
  {
    img: "/images/kering_pedas.jpeg",
    w: 960,
    h: 739,
    alt: "Batagor Kering Pedas",
    title: { id: "Batagor Kering Pedas", en: "Spicy Dry Batagor" },
    text: {
      id: "Setelah digoreng, dilumuri bubuk cabai kering ala jajanan kekinian yang pedas dan gurih.",
      en: "After frying, coated with dry chili powder for a spicy, savory, modern snack twist.",
    },
    detail: {
      id: "Varian jajanan kekinian yang digoreng hingga ekstra renyah seperti keripik, lalu dilumuri bumbu cabai bubuk kering dan daun jeruk yang harum. Karena tidak menggunakan kuah maupun saus kacang basah, batagor ini sangat praktis disantap kapan saja sebagai camilan pedas gurih yang tahan lama.",
      en: "A modern snack variation deep-fried until extra crispy like chips, then tossed in dry chili powder and fragrant kaffir lime leaves. Served without broth or wet peanut sauce, it is a convenient, long-lasting, spicy and savory treat to enjoy anytime.",
    },
  },
  {
    img: "/images/kuah_kari.jpeg",
    w: 680,
    h: 780,
    alt: "Batagor Kuah Kari",
    title: { id: "Batagor Kuah Kari", en: "Curry Batagor" },
    text: {
      id: "Variasi kuah dengan tambahan bumbu kari dan santan, memberi rasa gurih yang lebih kaya rempah.",
      en: "A soup variation with added curry spices and coconut milk, giving a richer, more fragrant savory flavor.",
    },
    detail: {
      id: "Variasi batagor berkuah yang memadukan gurihnya adonan ikan goreng dengan kuah kari kental berbumbu santan dan rempah pilihan. Aroma kunyit, ketumbar, dan kapulaga berpadu sempurna dengan tekstur batagor yang kenyal, menciptakan sensasi rasa hangat dan kaya rempah di setiap suapan.",
      en: "A soupy variation pairing savory fried fish dumplings with a rich, creamy coconut curry broth infused with aromatic spices. Notes of turmeric, coriander, and cardamom blend seamlessly with the chewy batagor, offering a warm and deeply flavorful experience in every spoonful.",
    },
  },
  {
    img: "/images/mini.jpeg",
    w: 388,
    h: 388,
    alt: "Batagor Mini",
    title: { id: "Batagor Mini", en: "Mini Batagor" },
    text: {
      id: "Dibuat dalam ukuran kecil seperti cocktail, cocok sebagai camilan pesta atau teman arisan.",
      en: "Made in small, bite-sized portions like cocktail snacks, perfect for parties or casual gatherings.",
    },
    detail: {
      id: "Dibuat dalam ukuran sekali lahap yang imut seperti camilan cocktail, sehingga sangat mudah disantap tanpa perlu dipotong lagi. Meski ukurannya lebih kecil, kerenyahan kulit pangsit dan gurihnya adonan ikan tetap terasa maksimal, menjadikannya favorit untuk hidangan pesta, arisan, atau camilan santai.",
      en: "Crafted in cute, bite-sized portions like cocktail snacks, making them effortless to enjoy without needing to cut them up. Despite their smaller size, the crispy wonton skin and savory fish filling remain just as delicious, making them a crowd favorite for parties, gatherings, or casual snacking.",
    },
  },
];