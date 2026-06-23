export type DhikrItem = {
  ar: string;
  translit?: string;
  en?: string;
  times?: number;
  source?: string;
};

export type DhikrCategory = {
  id: string;
  title_ar: string;
  title_en: string;
  items: DhikrItem[];
};

export const DHIKR: DhikrCategory[] = [
  {
    id: "morning",
    title_ar: "أذكار الصباح",
    title_en: "Morning Remembrance",
    items: [
      { ar: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ…", en: "Ayat al-Kursī (Qur'an 2:255). Whoever recites it in the morning is protected until evening.", times: 1 },
      { ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.", en: "We have entered the morning and at this very time all sovereignty belongs to Allah.", times: 1 },
      { ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.", en: "O Allah, by You we have reached the morning and by You the evening; by You we live and die.", times: 1 },
      { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.", en: "Glory and praise be to Allah.", times: 100 },
      { ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", en: "There is no deity except Allah alone, with no partner.", times: 10 },
    ],
  },
  {
    id: "evening",
    title_ar: "أذكار المساء",
    title_en: "Evening Remembrance",
    items: [
      { ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.", en: "We have entered the evening…", times: 1 },
      { ar: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ.", en: "O Allah, whatever blessing has reached me or any of Your creation is from You alone.", times: 1 },
      { ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.", en: "I seek refuge in the perfect words of Allah from the evil of what He has created.", times: 3 },
      { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", en: "In the name of Allah, with whose name nothing in the earth or the heavens can cause harm.", times: 3 },
    ],
  },
  {
    id: "after_prayer",
    title_ar: "أذكار بعد الصلاة",
    title_en: "After-Prayer Dhikr",
    items: [
      { ar: "أَسْتَغْفِرُ اللَّهَ.", en: "I seek Allah's forgiveness.", times: 3 },
      { ar: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.", en: "O Allah, You are Peace and from You comes peace.", times: 1 },
      { ar: "سُبْحَانَ اللَّهِ.", en: "Glory be to Allah.", times: 33 },
      { ar: "الْحَمْدُ لِلَّهِ.", en: "All praise is for Allah.", times: 33 },
      { ar: "اللَّهُ أَكْبَرُ.", en: "Allah is the Greatest.", times: 34 },
    ],
  },
  {
    id: "travel",
    title_ar: "أذكار السفر",
    title_en: "Travel Dhikr",
    items: [
      { ar: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ.", en: "Allah is Greatest (×3). Glory be to Him who has subjected this to us, we could not have done it ourselves.", times: 1 },
      { ar: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى.", en: "O Allah, we ask You on this journey for righteousness, piety and deeds pleasing to You.", times: 1 },
      { ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.", en: "I seek refuge in the perfect words of Allah from the evil He has created.", times: 3 },
    ],
  },
  {
    id: "sleep",
    title_ar: "أذكار النوم",
    title_en: "Before Sleep",
    items: [
      { ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.", en: "In Your name, O Allah, I die and I live.", times: 1 },
      { ar: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.", en: "O Allah, save me from Your punishment on the Day You resurrect Your servants.", times: 3 },
      { ar: "سُبْحَانَ اللَّهِ.", en: "Glory be to Allah.", times: 33 },
      { ar: "الْحَمْدُ لِلَّهِ.", en: "All praise is for Allah.", times: 33 },
      { ar: "اللَّهُ أَكْبَرُ.", en: "Allah is the Greatest.", times: 34 },
    ],
  },
  {
    id: "general",
    title_ar: "أذكار عامة",
    title_en: "General Dhikr",
    items: [
      { ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.", en: "There is no power nor might except with Allah.", times: 1 },
      { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.", en: "Glory to Allah and praise; Glory to Allah, the Magnificent.", times: 1 },
      { ar: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.", en: "O Allah, send prayers and peace upon our Prophet Muhammad.", times: 10 },
    ],
  },
];

export const AYAH_OF_DAY = {
  ar: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
  en: "And whoever fears Allah — He will make for him a way out, and will provide for him from where he does not expect.",
  ref: "Surah At-Talāq 65:2–3",
};

export const RECITERS = [
  { id: "ar.alafasy",     ar: "مشاري العفاسي",     en: "Mishary Al-Afasy",       mp3: "afs" },
  { id: "ar.abdulbasit",  ar: "عبد الباسط عبد الصمد", en: "Abdul Basit Abdul Samad", mp3: "abdul_basit" },
  { id: "ar.shaatree",    ar: "أبو بكر الشاطري",   en: "Abu Bakr Al-Shatri",      mp3: "shatri" },
  { id: "ar.minshawi",    ar: "محمد صديق المنشاوي",  en: "Mohamed Siddiq Al-Minshawi", mp3: "minsh" },
  { id: "ar.husary",      ar: "محمود خليل الحصري",   en: "Mahmoud Khalil Al-Husary", mp3: "husr" },
  { id: "ar.maher",       ar: "ماهر المعيقلي",      en: "Maher Al-Muaiqly",       mp3: "mahr192" },
] as const;

export type ReciterId = (typeof RECITERS)[number]["id"];
