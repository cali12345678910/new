// حصن المسلم — Hisn al-Muslim (Fortress of the Muslim).
// A comprehensive collection of authentic daily adhkar from the Qur'an & Sunnah,
// each with transliteration, translation, repeat count, source and virtue.

export type DhikrItem = {
  ar: string;
  translit?: string;
  en?: string;
  times?: number;
  source?: string;
  benefit_ar?: string;
  benefit_en?: string;
};

export type DhikrCategory = {
  id: string;
  icon: string; // lucide icon key, mapped in the UI
  title_ar: string;
  title_en: string;
  desc_ar?: string;
  desc_en?: string;
  items: DhikrItem[];
};

export const DHIKR: DhikrCategory[] = [
  {
    id: "waking",
    icon: "sunrise",
    title_ar: "أذكار الاستيقاظ",
    title_en: "Upon Waking",
    desc_ar: "ما يُقال عند الاستيقاظ من النوم",
    desc_en: "Said upon waking from sleep",
    items: [
      {
        ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.",
        translit: "Al-ḥamdu lillāhil-ladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr.",
        en: "All praise is for Allah who gave us life after He caused us to die, and to Him is the resurrection.",
        times: 1,
        source: "Bukhari 6312",
      },
      {
        ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
        en: "There is no deity but Allah alone, with no partner; His is the dominion and praise, and He is over all things competent…",
        times: 1,
        source: "Bukhari 1154",
        benefit_ar: "من قالها غُفر له، فإن دعا استُجيب له.",
        benefit_en: "Whoever says it is forgiven; if he then supplicates, he is answered.",
      },
    ],
  },
  {
    id: "morning",
    icon: "sun",
    title_ar: "أذكار الصباح",
    title_en: "Morning Remembrance",
    desc_ar: "تُقال بعد صلاة الفجر إلى طلوع الشمس",
    desc_en: "Recited after Fajr until sunrise",
    items: [
      {
        ar: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ…",
        en: "Āyat al-Kursī (Qur'an 2:255).",
        times: 1,
        source: "An-Nasa'i, al-Kubra 10795",
        benefit_ar: "من قالها حين يصبح أُجير من الجن حتى يمسي.",
        benefit_en: "Whoever recites it in the morning is protected from the jinn until evening.",
      },
      {
        ar: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.",
        en: "Sūrat al-Ikhlāṣ, with al-Falaq and an-Nās.",
        times: 3,
        source: "Abu Dawud 5082, Tirmidhi 3575",
        benefit_ar: "تكفيك من كل شيء (مع المعوذتين).",
        benefit_en: "Reciting these three suffices you from all things.",
      },
      {
        ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        translit: "Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh…",
        en: "We have entered the morning and at this very time all sovereignty belongs to Allah…",
        times: 1,
        source: "Muslim 2723",
      },
      {
        ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
        en: "O Allah, by You we enter the morning and the evening, by You we live and die, and to You is the resurrection.",
        times: 1,
        source: "Tirmidhi 3391",
      },
      {
        ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ…",
        en: "Sayyid al-Istighfār — the chief of seeking forgiveness.",
        times: 1,
        source: "Bukhari 6306",
        benefit_ar: "من قالها موقنًا فمات دخل الجنة.",
        benefit_en: "Whoever says it with certainty and dies that day enters Paradise.",
      },
      {
        ar: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.",
        translit: "Raḍītu billāhi rabban, wa bil-islāmi dīnan, wa bi-Muḥammadin nabiyyan.",
        en: "I am pleased with Allah as Lord, Islam as religion, and Muhammad ﷺ as Prophet.",
        times: 3,
        source: "Abu Dawud 5072",
        benefit_ar: "كان حقًّا على الله أن يُرضيه يوم القيامة.",
        benefit_en: "Allah has promised to please such a person on the Day of Judgement.",
      },
      {
        ar: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.",
        en: "Allah is sufficient for me; there is no deity but Him. Upon Him I rely, and He is the Lord of the Mighty Throne.",
        times: 7,
        source: "Abu Dawud 5081",
        benefit_ar: "كفاه الله ما أهمّه من أمر الدنيا والآخرة.",
        benefit_en: "Allah suffices him in whatever worries him of this life and the next.",
      },
      {
        ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
        translit: "Subḥānallāhi wa biḥamdih.",
        en: "Glory and praise be to Allah.",
        times: 100,
        source: "Muslim 2692",
        benefit_ar: "من قالها مئة مرة حُطّت خطاياه ولو كانت مثل زبد البحر.",
        benefit_en:
          "Whoever says it 100 times has his sins wiped away though they be like sea-foam.",
      },
      {
        ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        en: "There is no deity but Allah alone, with no partner; His is the dominion and praise, and He is over all things competent.",
        times: 10,
        source: "An-Nasa'i, ʿAmal al-Yawm 24",
      },
    ],
  },
  {
    id: "evening",
    icon: "moon",
    title_ar: "أذكار المساء",
    title_en: "Evening Remembrance",
    desc_ar: "تُقال بعد صلاة العصر إلى المغرب",
    desc_en: "Recited after Asr until Maghrib",
    items: [
      {
        ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        en: "We have entered the evening and at this time all sovereignty belongs to Allah…",
        times: 1,
        source: "Muslim 2723",
      },
      {
        ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
        en: "O Allah, by You we enter the evening and the morning, by You we live and die, and to You is the return.",
        times: 1,
        source: "Tirmidhi 3391",
      },
      {
        ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
        translit: "Aʿūdhu bikalimātillāhit-tāmmāti min sharri mā khalaq.",
        en: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        times: 3,
        source: "Muslim 2709",
        benefit_ar: "من قالها حين يمسي لم يضرّه شيء تلك الليلة.",
        benefit_en: "Whoever says it in the evening, nothing will harm him that night.",
      },
      {
        ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
        en: "In the name of Allah, with whose name nothing in the earth or the heavens can cause harm; He is the All-Hearing, All-Knowing.",
        times: 3,
        source: "Abu Dawud 5088",
        benefit_ar: "لم يضرّه شيء.",
        benefit_en: "Whoever says it three times, nothing will harm him.",
      },
      {
        ar: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
        en: "O Allah, whatever blessing has reached me or any of Your creation this evening is from You alone…",
        times: 1,
        source: "Abu Dawud 5073",
      },
      {
        ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ، وَشَرِّ عِبَادِهِ، وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ.",
        en: "I seek refuge in Allah's perfect words from His anger and punishment, the evil of His servants, and the whisperings of devils.",
        times: 1,
        source: "Abu Dawud 3893",
      },
    ],
  },
  {
    id: "after_prayer",
    icon: "sparkles",
    title_ar: "أذكار بعد الصلاة",
    title_en: "After the Prayer",
    desc_ar: "تُقال عقب كل صلاة مفروضة",
    desc_en: "Said after each obligatory prayer",
    items: [
      {
        ar: "أَسْتَغْفِرُ اللَّهَ.",
        translit: "Astaghfirullāh.",
        en: "I seek Allah's forgiveness.",
        times: 3,
        source: "Muslim 591",
      },
      {
        ar: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.",
        en: "O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of Majesty and Honour.",
        times: 1,
        source: "Muslim 591",
      },
      {
        ar: "سُبْحَانَ اللَّهِ.",
        translit: "Subḥānallāh.",
        en: "Glory be to Allah.",
        times: 33,
        source: "Muslim 597",
      },
      {
        ar: "الْحَمْدُ لِلَّهِ.",
        translit: "Al-ḥamdu lillāh.",
        en: "All praise is for Allah.",
        times: 33,
        source: "Muslim 597",
      },
      {
        ar: "اللَّهُ أَكْبَرُ.",
        translit: "Allāhu akbar.",
        en: "Allah is the Greatest.",
        times: 33,
        source: "Muslim 597",
      },
      {
        ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        en: "There is no deity but Allah alone… (completing the hundred).",
        times: 1,
        source: "Muslim 597",
        benefit_ar: "غُفرت خطاياه وإن كانت مثل زبد البحر.",
        benefit_en: "His sins are forgiven even if like the foam of the sea.",
      },
    ],
  },
  {
    id: "wudu",
    icon: "droplet",
    title_ar: "أذكار الوضوء",
    title_en: "Ablution (Wudū')",
    desc_ar: "ما يُقال قبل الوضوء وبعده",
    desc_en: "Said before and after ablution",
    items: [
      {
        ar: "بِسْمِ اللَّهِ.",
        translit: "Bismillāh.",
        en: "In the name of Allah. (before wudū')",
        times: 1,
        source: "Abu Dawud 101",
      },
      {
        ar: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.",
        en: "I bear witness that there is no deity but Allah alone, and that Muhammad is His servant and Messenger. (after wudū')",
        times: 1,
        source: "Muslim 234",
        benefit_ar: "فُتحت له أبواب الجنة الثمانية يدخل من أيها شاء.",
        benefit_en: "The eight gates of Paradise are opened for him to enter by any he wishes.",
      },
      {
        ar: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ.",
        en: "O Allah, make me among those who repent and those who purify themselves.",
        times: 1,
        source: "Tirmidhi 55",
      },
    ],
  },
  {
    id: "mosque",
    icon: "landmark",
    title_ar: "دخول وخروج المسجد",
    title_en: "Entering & Leaving the Mosque",
    items: [
      {
        ar: "أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ. بِسْمِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ.",
        en: "[On entering] … O Allah, open for me the gates of Your mercy.",
        times: 1,
        source: "Muslim 713, Abu Dawud 466",
      },
      {
        ar: "بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ.",
        en: "[On leaving] In the name of Allah, and peace upon the Messenger of Allah. O Allah, I ask You of Your bounty.",
        times: 1,
        source: "Muslim 713",
      },
    ],
  },
  {
    id: "home",
    icon: "house",
    title_ar: "دخول وخروج المنزل",
    title_en: "Entering & Leaving the Home",
    items: [
      {
        ar: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا.",
        en: "[On entering] In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.",
        times: 1,
        source: "Abu Dawud 5096",
      },
      {
        ar: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
        en: "[On leaving] In the name of Allah, I rely upon Allah; there is no power nor might except with Allah.",
        times: 1,
        source: "Abu Dawud 5095, Tirmidhi 3426",
        benefit_ar: "يُقال له: كُفيت وهُديت ووُقيت، وتنحّى عنه الشيطان.",
        benefit_en:
          "It is said to him: you are sufficed, guided and protected, and Satan withdraws from him.",
      },
    ],
  },
  {
    id: "food",
    icon: "utensils",
    title_ar: "أذكار الطعام",
    title_en: "Before & After Eating",
    items: [
      {
        ar: "بِسْمِ اللَّهِ.",
        translit: "Bismillāh.",
        en: "In the name of Allah. (before eating; if forgotten: Bismillāhi awwalahu wa ākhirah)",
        times: 1,
        source: "Abu Dawud 3767",
      },
      {
        ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ.",
        en: "Praise be to Allah who fed me this and provided it for me without any might or power on my part.",
        times: 1,
        source: "Abu Dawud 4023, Tirmidhi 3458",
        benefit_ar: "غُفر له ما تقدّم من ذنبه.",
        benefit_en: "Whoever says it after eating, his past sins are forgiven.",
      },
      {
        ar: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ.",
        en: "O Allah, bless it for us and feed us better than it. (for milk: …and increase us in it)",
        times: 1,
        source: "Tirmidhi 3455",
      },
    ],
  },
  {
    id: "bathroom",
    icon: "door-open",
    title_ar: "دخول وخروج الخلاء",
    title_en: "Entering & Leaving the Restroom",
    items: [
      {
        ar: "بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ.",
        en: "[On entering] In the name of Allah. O Allah, I seek refuge in You from male and female devils.",
        times: 1,
        source: "Bukhari 142, Muslim 375",
      },
      {
        ar: "غُفْرَانَكَ.",
        translit: "Ghufrānak.",
        en: "[On leaving] I seek Your forgiveness.",
        times: 1,
        source: "Abu Dawud 30, Tirmidhi 7",
      },
    ],
  },
  {
    id: "distress",
    icon: "heart",
    title_ar: "أذكار الكرب والهمّ",
    title_en: "Anxiety & Distress",
    desc_ar: "أدعية تفريج الهمّ والحزن",
    desc_en: "Supplications for relief from worry & grief",
    items: [
      {
        ar: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ.",
        en: "There is no deity but Allah, the Magnificent, the Forbearing… Lord of the Mighty Throne… (du'ā of distress)",
        times: 1,
        source: "Bukhari 6346, Muslim 2730",
      },
      {
        ar: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ.",
        en: "O Allah, I hope for Your mercy, so do not leave me to myself for the blink of an eye; set right all my affairs. There is no deity but You.",
        times: 1,
        source: "Abu Dawud 5090",
      },
      {
        ar: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.",
        translit: "Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn.",
        en: "There is no deity but You, glory be to You; indeed I was among the wrongdoers. (du'ā of Yūnus)",
        times: 1,
        source: "Tirmidhi 3505",
        benefit_ar: "ما دعا بها مسلم في شيء قطّ إلا استجاب الله له.",
        benefit_en: "No Muslim ever supplicates with it for anything but Allah answers him.",
      },
      {
        ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ.",
        translit: "Ḥasbunallāhu wa niʿmal-wakīl.",
        en: "Allah is sufficient for us, and an excellent Guardian is He.",
        times: 1,
        source: "Bukhari 4563",
      },
    ],
  },
  {
    id: "istighfar",
    icon: "rotate-ccw",
    title_ar: "الاستغفار والتوبة",
    title_en: "Seeking Forgiveness",
    items: [
      {
        ar: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ.",
        en: "I seek the forgiveness of Allah the Magnificent, there is no deity but Him, the Ever-Living, the Sustainer, and I repent to Him.",
        times: 3,
        source: "Abu Dawud 1517, Tirmidhi 3577",
        benefit_ar: "غُفر له وإن كان فرّ من الزحف.",
        benefit_en: "He is forgiven even if he fled from the battlefield.",
      },
      {
        ar: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.",
        translit: "Astaghfirullāha wa atūbu ilayh.",
        en: "I seek Allah's forgiveness and turn to Him in repentance.",
        times: 100,
        source: "Bukhari 6307, Muslim 2702",
      },
    ],
  },
  {
    id: "salawat",
    icon: "star",
    title_ar: "الصلاة على النبي ﷺ",
    title_en: "Blessings on the Prophet ﷺ",
    items: [
      {
        ar: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ.",
        en: "O Allah, send blessings upon Muhammad and the family of Muhammad, as You blessed Ibrāhīm…",
        times: 10,
        source: "Bukhari 3370",
        benefit_ar: "من صلّى عليه واحدةً صلّى الله عليه بها عشرًا.",
        benefit_en: "Whoever sends blessings once, Allah sends ten upon him.",
      },
      {
        ar: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.",
        translit: "Allāhumma ṣalli wa sallim ʿalā nabiyyinā Muḥammad.",
        en: "O Allah, send prayers and peace upon our Prophet Muhammad.",
        times: 10,
        source: "Muslim 408",
      },
    ],
  },
  {
    id: "travel",
    icon: "plane",
    title_ar: "أذكار السفر",
    title_en: "Travel",
    items: [
      {
        ar: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ.",
        en: "Allah is Greatest (×3). Glory to Him who subjected this to us; we could not have done it ourselves, and to our Lord we will surely return.",
        times: 1,
        source: "Muslim 1342",
      },
      {
        ar: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى…",
        en: "O Allah, we ask You on this journey for righteousness, piety and deeds pleasing to You…",
        times: 1,
        source: "Muslim 1342",
      },
      {
        ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
        en: "[Stopping at a place] I seek refuge in the perfect words of Allah from the evil He has created.",
        times: 3,
        source: "Muslim 2708",
      },
    ],
  },
  {
    id: "sleep",
    icon: "bed",
    title_ar: "أذكار النوم",
    title_en: "Before Sleep",
    items: [
      {
        ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.",
        translit: "Bismika Allāhumma amūtu wa aḥyā.",
        en: "In Your name, O Allah, I die and I live.",
        times: 1,
        source: "Bukhari 6324",
      },
      {
        ar: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.",
        en: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
        times: 3,
        source: "Abu Dawud 5045",
      },
      {
        ar: "سُبْحَانَ اللَّهِ.",
        translit: "Subḥānallāh.",
        en: "Glory be to Allah.",
        times: 33,
        source: "Bukhari 5362",
      },
      {
        ar: "الْحَمْدُ لِلَّهِ.",
        translit: "Al-ḥamdu lillāh.",
        en: "All praise is for Allah.",
        times: 33,
        source: "Bukhari 5362",
      },
      {
        ar: "اللَّهُ أَكْبَرُ.",
        translit: "Allāhu akbar.",
        en: "Allah is the Greatest.",
        times: 34,
        source: "Bukhari 5362",
      },
    ],
  },
  {
    id: "quran_duas",
    icon: "book-open",
    title_ar: "أدعية قرآنية",
    title_en: "Qur'anic Supplications",
    items: [
      {
        ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.",
        en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
        times: 1,
        source: "Qur'an 2:201",
      },
      {
        ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا.",
        en: "Our Lord, do not take us to task if we forget or err.",
        times: 1,
        source: "Qur'an 2:286",
      },
      {
        ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي.",
        en: "My Lord, expand for me my chest and ease for me my task.",
        times: 1,
        source: "Qur'an 20:25–26",
      },
      {
        ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا.",
        en: "Our Lord, grant us comfort in our spouses and offspring, and make us leaders for the righteous.",
        times: 1,
        source: "Qur'an 25:74",
      },
    ],
  },
  {
    id: "general",
    icon: "circle-dot",
    title_ar: "تسبيحات وأذكار عامة",
    title_en: "General Tasbīḥ",
    items: [
      {
        ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.",
        translit: "Subḥānallāhi wa biḥamdih, subḥānallāhil-ʿaẓīm.",
        en: "Glory and praise to Allah; glory to Allah the Magnificent.",
        times: 1,
        source: "Bukhari 6406, Muslim 2694",
        benefit_ar: "كلمتان خفيفتان على اللسان ثقيلتان في الميزان حبيبتان إلى الرحمن.",
        benefit_en:
          "Two words light on the tongue, heavy on the scale, beloved to the Most Merciful.",
      },
      {
        ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
        translit: "Lā ḥawla wa lā quwwata illā billāh.",
        en: "There is no power nor might except with Allah.",
        times: 1,
        source: "Bukhari 6384",
        benefit_ar: "كنزٌ من كنوز الجنة.",
        benefit_en: "A treasure from the treasures of Paradise.",
      },
      {
        ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        en: "There is no deity but Allah alone, with no partner; His is the dominion and praise, and He is over all things competent.",
        times: 10,
        source: "Bukhari 3293, Muslim 2691",
      },
      {
        ar: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ.",
        en: "Glory to Allah, praise to Allah, there is no deity but Allah, and Allah is the Greatest.",
        times: 1,
        source: "Muslim 2695",
        benefit_ar: "أحبّ الكلام إلى الله أربع.",
        benefit_en: "The most beloved words to Allah are these four.",
      },
    ],
  },
];

export const AYAH_OF_DAY = {
  ar: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
  en: "And whoever fears Allah — He will make for him a way out, and will provide for him from where he does not expect.",
  ref: "Surah At-Talāq 65:2–3",
};

// `server`/`mp3` map to the per-reciter mushaf folders on mp3quran.net; each
// reciter lives on a specific server host (verified to return the surah audio).
export const RECITERS = [
  { id: "ar.alafasy", ar: "مشاري العفاسي", en: "Mishary Al-Afasy", server: 8, mp3: "afs" },
  {
    id: "ar.abdulbasit",
    ar: "عبد الباسط عبد الصمد",
    en: "Abdul Basit Abdul Samad",
    server: 7,
    mp3: "basit",
  },
  { id: "ar.shaatree", ar: "أبو بكر الشاطري", en: "Abu Bakr Al-Shatri", server: 11, mp3: "shatri" },
  {
    id: "ar.minshawi",
    ar: "محمد صديق المنشاوي",
    en: "Mohamed Siddiq Al-Minshawi",
    server: 10,
    mp3: "minsh",
  },
  {
    id: "ar.husary",
    ar: "محمود خليل الحصري",
    en: "Mahmoud Khalil Al-Husary",
    server: 13,
    mp3: "husr",
  },
  { id: "ar.maher", ar: "ماهر المعيقلي", en: "Maher Al-Muaiqly", server: 12, mp3: "maher" },
] as const;

export type ReciterId = (typeof RECITERS)[number]["id"];
