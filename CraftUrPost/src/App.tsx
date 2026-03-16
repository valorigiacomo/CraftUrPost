/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Palette, 
  Type,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Instagram,
  ShoppingBag,
  Dumbbell,
  Utensils,
  Camera,
  Cpu,
  Plane,
  Layers,
  Link as LinkIcon,
  Maximize2,
  Square,
  Smartphone,
  Search,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  BarChart3,
  Target,
  Send,
  Globe,
  ChevronDown,
  Music,
  Trophy,
  ShieldCheck,
  ShieldAlert,
  Share2
} from 'lucide-react';
import { cn } from './lib/utils';
import { generateBrandPost, searchTrends, getTrendingMusic, analyzeSocialPost, chatWithMarketer, type TrendItem, type MusicTrend } from './services/geminiService';

const STYLES = [
  { id: 'minimalist', name: 'Minimalist', description: 'Clean & Elegant', color: 'bg-stone-100' },
  { id: 'brutalist', name: 'Brutalist', description: 'Bold & Raw', color: 'bg-zinc-900' },
  { id: 'luxury', name: 'Luxury', description: 'Premium & Moody', color: 'bg-amber-900' },
  { id: 'organic', name: 'Organic', description: 'Warm & Natural', color: 'bg-emerald-50' },
  { id: 'tech', name: 'Tech', description: 'Futuristic & Sleek', color: 'bg-blue-900' },
  { id: 'vibrant', name: 'Vibrant', description: 'Pop & Energy', color: 'bg-rose-500' },
  { id: 'retro', name: 'Retro', description: 'Vintage Vibe', color: 'bg-orange-200' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon Future', color: 'bg-fuchsia-600' },
  { id: 'pastel', name: 'Pastel', description: 'Soft & Dreamy', color: 'bg-sky-100' },
  { id: 'editorial', name: 'Editorial', description: 'Magazine Style', color: 'bg-zinc-200' },
  { id: 'streetwear', name: 'Streetwear', description: 'Urban & Gritty', color: 'bg-neutral-800' },
];

const CATEGORIES = [
  { id: 'general', name: 'General', icon: Layers },
  { id: 'sport', name: 'Sport', icon: Dumbbell },
  { id: 'fashion', name: 'Fashion', icon: ShoppingBag },
  { id: 'food', name: 'Food', icon: Utensils },
  { id: 'beauty', name: 'Beauty', icon: Camera },
  { id: 'tech_gadgets', name: 'Tech', icon: Cpu },
  { id: 'travel', name: 'Travel', icon: Plane },
];

const ASPECT_RATIOS = [
  { id: '1:1', name: 'Square', icon: Square, desc: 'Post' },
  { id: '4:5', name: 'Portrait', icon: Smartphone, desc: 'Feed' },
  { id: '9:16', name: 'Story', icon: Smartphone, desc: 'Reels' },
  { id: '16:9', name: 'Landscape', icon: Maximize2, desc: 'Wide' },
] as const;

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

const TRANSLATIONS: Record<string, any> = {
  en: {
    generator: "Generator",
    trends: "Trends",
    audit: "Social Expert",
    proAccount: "Pro Account",
    heroTitle: "Craft your brand story.",
    heroDesc: "The ultimate AI-powered social media post generator for modern brands. Upload your logo, set your style, and let AI do the rest.",
    uploadLogo: "Upload Brand Logo",
    logoDesc: "PNG or SVG preferred, max 5MB",
    referenceUrl: "Style Reference URL",
    referencePlaceholder: "Paste a link to a post you love (Instagram, Pinterest...)",
    selectStyle: "Select Style",
    selectCategory: "Select Category",
    aspectRatio: "Aspect Ratio",
    generate: "Generate Brand Post",
    generating: "Crafting Magic...",
    livePreview: "Live Preview",
    previewDesc: "See your brand come to life",
    readyToDesign: "Ready to Design",
    readyToDesignDesc: "Your professional brand post will appear here once you hit generate.",
    trendsTitle: "Discover Trends.",
    trendsDesc: "Search for the latest visual inspiration across social media to fuel your next brand post.",
    trendsPlaceholder: "Search for trends (e.g., 'minimalist coffee', 'sustainable fashion')",
    trendsSearch: "Search",
    trendsUseInspiration: "Use as Inspiration",
    auditTitle: "Improve your post.",
    auditDesc: "Upload your content and let our AI Social Media Marketer give you expert advice to boost your engagement and reach.",
    auditUpload: "Upload Content",
    auditUploadDesc: "Upload Image or Video",
    auditUploadSub: "Show us what you're planning to post",
    auditPlatform: "Target Platform",
    auditObjectives: "Your Objectives",
    auditObjectivesPlaceholder: "e.g., 'I want to increase my engagement rate and get more sales'",
    auditAnalyze: "Get Expert Advice",
    auditAnalyzing: "AI Marketer is thinking...",
    auditWaiting: "Waiting for your content",
    auditWaitingDesc: "Upload a post and set your goals to start the audit.",
    auditChatPlaceholder: "Ask a follow-up question...",
    auditExpertQuote: "This advice is based on current algorithm trends and psychological triggers. Implement these changes for immediate impact.",
    share: "Share",
  },
  it: {
    generator: "Generatore",
    trends: "Trend",
    audit: "Social Expert",
    proAccount: "Account Pro",
    heroTitle: "Crea la storia del tuo brand.",
    heroDesc: "Il generatore di post per social media basato su IA definitivo per i brand moderni. Carica il tuo logo, imposta il tuo stile e lascia che l'IA faccia il resto.",
    uploadLogo: "Carica Logo del Brand",
    logoDesc: "Preferibile PNG o SVG, max 5MB",
    referenceUrl: "URL di Riferimento Stile",
    referencePlaceholder: "Incolla un link a un post che ami (Instagram, Pinterest...)",
    aspectRatio: "Rapporto d'Aspetto",
    selectCategory: "Categoria Settore",
    selectStyle: "Stile Visuale",
    describePost: "Contenuto del Post",
    describePlaceholder: "Descrivi cosa vuoi mostrare nel post (es. 'Una tazzina di caffè minimalista su un tavolo di marmo con luce mattutina')",
    generate: "Genera Post del Brand",
    generating: "Creazione in corso...",
    livePreview: "Anteprima Live",
    previewDesc: "Guarda il tuo brand prendere vita",
    readyToDesign: "Pronto per il Design",
    readyToDesignDesc: "Il tuo post professionale apparirà qui una volta cliccato su genera.",
    trendsTitle: "Scopri i Trend.",
    trendsDesc: "Cerca l'ultima ispirazione visiva sui social media per alimentare il tuo prossimo post.",
    trendsPlaceholder: "Cerca trend (es. 'caffè minimalista', 'moda sostenibile')",
    trendsSearch: "Cerca",
    trendsUseInspiration: "Usa come Ispirazione",
    auditTitle: "Migliora il tuo post.",
    auditDesc: "Carica il tuo contenuto e lascia che il nostro AI Social Media Marketer ti dia consigli esperti per aumentare il coinvolgimento e la copertura.",
    auditUpload: "Carica Contenuto",
    auditUploadDesc: "Carica Immagine o Video",
    auditUploadSub: "Mostraci cosa hai intenzione di pubblicare",
    auditPlatform: "Piattaforma Target",
    auditObjectives: "I Tuoi Obiettivi",
    auditObjectivesPlaceholder: "es. 'Voglio aumentare il mio tasso di coinvolgimento e ottenere più vendite'",
    auditAnalyze: "Ottieni Consigli Esperti",
    auditAnalyzing: "L'AI Marketer sta pensando...",
    auditWaiting: "In attesa del tuo contenuto",
    auditWaitingDesc: "Carica un post e imposta i tuoi obiettivi per iniziare l'audit.",
    auditChatPlaceholder: "Fai una domanda di approfondimento...",
    auditExpertQuote: "Questi consigli si basano sulle attuali tendenze degli algoritmi e sui trigger psicologici. Implementa queste modifiche per un impatto immediato.",
    share: "Condividi",
  },
  fr: {
    generator: "Générateur",
    trends: "Tendances",
    audit: "Social Expert",
    proAccount: "Compte Pro",
    heroTitle: "Créez l'histoire de votre marque.",
    heroDesc: "Le générateur de posts IA ultime pour les marques modernes. Téléchargez votre logo, choisissez votre style et laissez l'IA faire le reste.",
    uploadLogo: "Télécharger le logo",
    logoDesc: "PNG ou SVG préféré, max 5Mo",
    referenceUrl: "URL de référence de style",
    referencePlaceholder: "Collez un lien vers un post que vous aimez",
    aspectRatio: "Format",
    selectCategory: "Catégorie",
    selectStyle: "Style visuel",
    describePost: "Contenu du post",
    describePlaceholder: "Décrivez ce que vous voulez montrer",
    generate: "Générer le post",
    generating: "Création en cours...",
    livePreview: "Aperçu en direct",
    previewDesc: "Voyez votre marque prendre vie",
    readyToDesign: "Prêt à concevoir",
    readyToDesignDesc: "Votre post apparaîtra ici après la génération.",
    trendsTitle: "Découvrez les tendances.",
    trendsDesc: "Recherchez les dernières inspirations visuelles sur les réseaux sociaux.",
    trendsPlaceholder: "Rechercher des tendances...",
    trendsSearch: "Chercher",
    trendsUseInspiration: "Utiliser comme inspiration",
    auditTitle: "Améliorez votre post.",
    auditDesc: "Téléchargez votre contenu et recevez les conseils de notre expert IA.",
    auditUpload: "Télécharger le contenu",
    auditUploadDesc: "Image ou Vidéo",
    auditUploadSub: "Montrez-nous votre projet",
    auditPlatform: "Plateforme cible",
    auditObjectives: "Vos objectifs",
    auditObjectivesPlaceholder: "ex: 'Augmenter l'engagement'",
    auditAnalyze: "Obtenir des conseils",
    auditAnalyzing: "L'expert IA réfléchit...",
    auditWaiting: "En attente de contenu",
    auditWaitingDesc: "Téléchargez un post pour commencer l'audit.",
    auditChatPlaceholder: "Poser une question...",
    auditExpertQuote: "Ces conseils sont basés sur les tendances actuelles des algorithmes.",
    share: "Partager",
  },
  de: {
    generator: "Generator",
    trends: "Trends",
    audit: "Social Expert",
    proAccount: "Pro-Konto",
    heroTitle: "Erzählen Sie Ihre Markengeschichte.",
    heroDesc: "Der ultimative KI-Generator für Social-Media-Posts. Logo hochladen, Stil wählen, fertig.",
    uploadLogo: "Logo hochladen",
    logoDesc: "PNG oder SVG bevorzugt, max. 5MB",
    referenceUrl: "Stil-Referenz-URL",
    referencePlaceholder: "Link zu einem Post einfügen",
    aspectRatio: "Seitenverhältnis",
    selectCategory: "Kategorie",
    selectStyle: "Visueller Stil",
    describePost: "Post-Inhalt",
    describePlaceholder: "Beschreiben Sie Ihren Post",
    generate: "Post generieren",
    generating: "Erstellung läuft...",
    livePreview: "Live-Vorschau",
    previewDesc: "Ihre Marke wird lebendig",
    readyToDesign: "Bereit zum Designen",
    readyToDesignDesc: "Ihr Post erscheint hier nach der Generierung.",
    trendsTitle: "Trends entdecken.",
    trendsDesc: "Suchen Sie nach visueller Inspiration in sozialen Medien.",
    trendsPlaceholder: "Nach Trends suchen...",
    trendsSearch: "Suchen",
    trendsUseInspiration: "Als Inspiration nutzen",
    auditTitle: "Post verbessern.",
    auditDesc: "Inhalte hochladen und KI-Marketing-Tipps erhalten.",
    auditUpload: "Inhalt hochladen",
    auditUploadDesc: "Bild oder Video",
    auditUploadSub: "Zeigen Sie uns Ihren Post",
    auditPlatform: "Zielplattform",
    auditObjectives: "Ihre Ziele",
    auditObjectivesPlaceholder: "z.B. 'Engagement steigern'",
    auditAnalyze: "Expertenrat einholen",
    auditAnalyzing: "KI-Marketer denkt nach...",
    auditWaiting: "Warten auf Inhalt",
    auditWaitingDesc: "Laden Sie einen Post hoch, um das Audit zu starten.",
    auditChatPlaceholder: "Nachfrage stellen...",
    auditExpertQuote: "Diese Ratschläge basieren auf aktuellen Algorithmus-Trends.",
    share: "Teilen",
  },
  ru: {
    generator: "Генератор",
    trends: "Тренды",
    audit: "Social Expert",
    proAccount: "Pro Аккаунт",
    heroTitle: "Создайте историю вашего бренда.",
    heroDesc: "Лучший ИИ-генератор постов для соцсетей. Загрузите логотип, выберите стиль, а остальное сделает ИИ.",
    uploadLogo: "Загрузить логотип",
    logoDesc: "PNG или SVG, макс. 5МБ",
    referenceUrl: "Ссылка на стиль",
    referencePlaceholder: "Вставьте ссылку на понравившийся пост",
    aspectRatio: "Соотношение сторон",
    selectCategory: "Категория",
    selectStyle: "Визуальный стиль",
    describePost: "Содержание поста",
    describePlaceholder: "Опишите ваш пост",
    generate: "Создать пост",
    generating: "Создание...",
    livePreview: "Предпросмотр",
    previewDesc: "Ваш бренд оживает",
    readyToDesign: "Готов к дизайну",
    readyToDesignDesc: "Ваш пост появится здесь после генерации.",
    trendsTitle: "Открывайте тренды.",
    trendsDesc: "Ищите визуальное вдохновение в социальных сетях.",
    trendsPlaceholder: "Поиск трендов...",
    trendsSearch: "Поиск",
    trendsUseInspiration: "Использовать для вдохновения",
    auditTitle: "Улучшите ваш пост.",
    auditDesc: "Загрузите контент и получите советы от ИИ-маркетолога.",
    auditUpload: "Загрузить контент",
    auditUploadDesc: "Изображение или видео",
    auditUploadSub: "Покажите нам ваш пост",
    auditPlatform: "Платформа",
    auditObjectives: "Ваши цели",
    auditObjectivesPlaceholder: "например, 'увеличить вовлеченность'",
    auditAnalyze: "Получить совет",
    auditAnalyzing: "ИИ-маркетолог думает...",
    auditWaiting: "Ожидание контента",
    auditWaitingDesc: "Загрузите пост, чтобы начать аудит.",
    auditChatPlaceholder: "Задать вопрос...",
    auditExpertQuote: "Эти советы основаны на текущих трендах алгоритмов.",
    share: "Поделиться",
  },
  hi: {
    generator: "जेनरेटर",
    trends: "ट्रेंड्स",
    audit: "Social Expert",
    proAccount: "प्रो अकाउंट",
    heroTitle: "अपनी ब्रांड कहानी बनाएं।",
    heroDesc: "आधुनिक ब्रांडों के लिए सर्वश्रेष्ठ AI-संचालित सोशल मीडिया पोस्ट जेनरेटर।",
    uploadLogo: "लोगो अपलोड करें",
    logoDesc: "PNG या SVG, अधिकतम 5MB",
    referenceUrl: "स्टाइल संदर्भ URL",
    referencePlaceholder: "पसंद की पोस्ट का लिंक पेस्ट करें",
    aspectRatio: "आस्पेक्ट रेशियो",
    selectCategory: "श्रेणी",
    selectStyle: "विजुअल स्टाइल",
    describePost: "पोस्ट सामग्री",
    describePlaceholder: "अपनी पोस्ट का वर्णन करें",
    generate: "पोस्ट जेनरेट करें",
    generating: "बनाया जा रहा है...",
    livePreview: "लाइव प्रीव्यू",
    previewDesc: "अपने ब्रांड को जीवंत होते देखें",
    readyToDesign: "डिजाइन के लिए तैयार",
    readyToDesignDesc: "जेनरेट करने के बाद आपकी पोस्ट यहाँ दिखाई देगी।",
    trendsTitle: "ट्रेंड्स खोजें।",
    trendsDesc: "सोशल मीडिया पर नवीनतम विजुअल प्रेरणा खोजें।",
    trendsPlaceholder: "ट्रेंड्स खोजें...",
    trendsSearch: "खोजें",
    trendsUseInspiration: "प्रेरणा के रूप में उपयोग करें",
    auditTitle: "अपनी पोस्ट सुधारें।",
    auditDesc: "अपना कंटेंट अपलोड करें और AI मार्केटर से सलाह लें।",
    auditUpload: "कंटेंट अपलोड करें",
    auditUploadDesc: "इमेज या वीडियो",
    auditUploadSub: "हमें दिखाएं कि आप क्या पोस्ट करने वाले हैं",
    auditPlatform: "प्लेटफॉर्म",
    auditObjectives: "आपके उद्देश्य",
    auditObjectivesPlaceholder: "जैसे, 'जुड़ाव बढ़ाना चाहते हैं'",
    auditAnalyze: "विशेषज्ञ सलाह लें",
    auditAnalyzing: "AI मार्केटर सोच रहा है...",
    auditWaiting: "कंटेंट का इंतज़ार",
    auditWaitingDesc: "ऑडिट शुरू करने के लिए पोस्ट अपलोड करें।",
    auditChatPlaceholder: "एक और सवाल पूछें...",
    auditExpertQuote: "यह सलाह वर्तमान एल्गोरिदम ट्रेंड्स पर आधारित है।",
    share: "साझा करें",
  },
  zh: {
    generator: "生成器",
    trends: "趋势",
    audit: "Social Expert",
    proAccount: "专业账户",
    heroTitle: "打造您的品牌故事。",
    heroDesc: "为现代品牌打造的终极 AI 社交媒体帖子生成器。",
    uploadLogo: "上传品牌 Logo",
    logoDesc: "优先选择 PNG 或 SVG，最大 5MB",
    referenceUrl: "风格参考 URL",
    referencePlaceholder: "粘贴您喜欢的帖子链接",
    aspectRatio: "宽高比",
    selectCategory: "选择类别",
    selectStyle: "视觉风格",
    describePost: "帖子内容",
    describePlaceholder: "描述您想在帖子中展示的内容",
    generate: "生成品牌帖子",
    generating: "正在精心制作...",
    livePreview: "实时预览",
    previewDesc: "见证您的品牌焕发生机",
    readyToDesign: "准备设计",
    readyToDesignDesc: "点击生成后，您的专业帖子将显示在这里。",
    trendsTitle: "发现趋势。",
    trendsDesc: "在社交媒体上搜索最新的视觉灵感。",
    trendsPlaceholder: "搜索趋势...",
    trendsSearch: "搜索",
    trendsUseInspiration: "作为灵感使用",
    auditTitle: "改进您的帖子。",
    auditDesc: "上传您的内容，让我们的 AI 营销专家为您提供建议。",
    auditUpload: "上传内容",
    auditUploadDesc: "图片或视频",
    auditUploadSub: "向我们展示您计划发布的内容",
    auditPlatform: "目标平台",
    auditObjectives: "您的目标",
    auditObjectivesPlaceholder: "例如：'我想提高参与率'",
    auditAnalyze: "获取专家建议",
    auditAnalyzing: "AI 营销专家正在思考...",
    auditWaiting: "等待您的内容",
    auditWaitingDesc: "上传帖子并设定目标以开始审核。",
    auditChatPlaceholder: "提出后续问题...",
    auditExpertQuote: "此建议基于当前的算法趋势。",
  },
};

export default function App() {
  const [logo, setLogo] = useState<{ base64: string; mimeType: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [selectedRatio, setSelectedRatio] = useState<typeof ASPECT_RATIOS[number]['id']>('1:1');
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS.en;
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trends State
  const [activeTab, setActiveTab] = useState<'generator' | 'trends' | 'improve'>('generator');
  const [trendQuery, setTrendQuery] = useState('');
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [musicTrends, setMusicTrends] = useState<MusicTrend[]>([]);
  const [isSearchingTrends, setIsSearchingTrends] = useState(false);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);

  // Improve Post State
  const [improveFile, setImproveFile] = useState<{ base64: string; mimeType: string } | null>(null);
  const [improveGoals, setImproveGoals] = useState('');
  const [improvePlatform, setImprovePlatform] = useState('Instagram');
  const [improveFeedback, setImproveFeedback] = useState<string | null>(null);
  const [improveChatInput, setImproveChatInput] = useState('');
  const [improveChatHistory, setImproveChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const improveFileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when tab changes and fetch music if trends tab
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (activeTab === 'trends' && musicTrends.length === 0) {
      fetchMusicTrends();
    }
  }, [activeTab]);

  const fetchMusicTrends = async () => {
    setIsLoadingMusic(true);
    try {
      const music = await getTrendingMusic(selectedLanguage.name);
      setMusicTrends(music);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMusic(false);
    }
  };

  const handleImproveFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setImproveFile({ base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleImprovePost = async () => {
    if (!improveFile || !improveGoals) return;

    setIsImproving(true);
    setImproveFeedback(null);
    setImproveChatHistory([]);
    try {
      const feedback = await analyzeSocialPost(
        improveFile.base64,
        improveFile.mimeType,
        improveGoals,
        improvePlatform,
        selectedLanguage.name
      );
      setImproveFeedback(feedback);
      setImproveChatHistory([{ role: 'model', text: feedback }]);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze post.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleImproveChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!improveChatInput.trim() || isChatting) return;

    const userMessage = improveChatInput.trim();
    setImproveChatInput('');
    const newHistory = [...improveChatHistory, { role: 'user' as const, text: userMessage }];
    setImproveChatHistory(newHistory);
    setIsChatting(true);

    try {
      const response = await chatWithMarketer(
        newHistory,
        userMessage,
        improveFile?.base64,
        improveFile?.mimeType,
        selectedLanguage.name
      );
      setImproveChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      console.error(err);
      setError('Failed to send message.');
    } finally {
      setIsChatting(false);
    }
  };

  const handleSearchTrends = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trendQuery.trim()) return;

    setIsSearchingTrends(true);
    try {
      const results = await searchTrends(trendQuery, selectedLanguage.name);
      setTrends(results);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch trends.');
    } finally {
      setIsSearchingTrends(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo({
          base64: (reader.result as string).split(',')[1],
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a description for your post.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generateBrandPost({
        prompt,
        style: selectedStyle,
        category: selectedCategory,
        aspectRatio: selectedRatio,
        logoBase64: logo?.base64,
        logoMimeType: logo?.mimeType,
        referenceUrl: referenceUrl.trim() || undefined
      }, selectedLanguage.name);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `crafturpost-${selectedStyle}-${selectedRatio.replace(':', '-')}.png`;
    link.click();
  };

  const shareImage = async () => {
    if (!generatedImage) return;

    try {
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      const file = new File([blob], 'brand-post.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Brand Post',
          text: 'Check out this brand post I generated with AI!',
        });
      } else {
        const shareUrl = window.location.href;
        if (navigator.share) {
          await navigator.share({
            title: 'My Brand Post',
            text: 'Check out this brand post I generated with AI!',
            url: shareUrl
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard! Sharing files is not supported in this browser.');
        }
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-violet-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">CraftUrPost</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('generator')}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                activeTab === 'generator' ? "bg-white text-slate-950 shadow-xl" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {t.generator}
            </button>
            <button 
              onClick={() => setActiveTab('trends')}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                activeTab === 'trends' ? "bg-white text-slate-950 shadow-xl" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {t.trends}
            </button>
            <button 
              onClick={() => setActiveTab('improve')}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                activeTab === 'improve' ? "bg-white text-slate-950 shadow-xl" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {t.audit}
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-slate-300">{selectedLanguage.flag}</span>
                <ChevronDown className={cn("w-3 h-3 text-slate-500 transition-transform", isLangMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-40 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                  >
                    <div className="p-1">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang);
                            setIsLangMenuOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-all rounded-xl",
                            selectedLanguage.code === lang.code 
                              ? "bg-indigo-600 text-white" 
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">{t.proAccount}</span>
              <span className="text-xs text-slate-400">valorigiacomo184@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="glass bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 flex items-center justify-around shadow-2xl shadow-black/50">
          <button 
            onClick={() => setActiveTab('generator')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all",
              activeTab === 'generator' ? "bg-indigo-600 text-white" : "text-slate-400"
            )}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t.generator}</span>
          </button>
          <button 
            onClick={() => setActiveTab('trends')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all",
              activeTab === 'trends' ? "bg-indigo-600 text-white" : "text-slate-400"
            )}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t.trends}</span>
          </button>
          <button 
            onClick={() => setActiveTab('improve')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all",
              activeTab === 'improve' ? "bg-indigo-600 text-white" : "text-slate-400"
            )}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t.audit}</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 pb-32 md:pb-12 relative">
        {/* Mobile Central Navigation "Windows" */}
        <div className="md:hidden grid grid-cols-3 gap-3 mb-10">
          <button 
            onClick={() => setActiveTab('generator')}
            className={cn(
              "glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all duration-300",
              activeTab === 'generator' 
                ? "border-indigo-500/50 bg-indigo-600/20 shadow-lg shadow-indigo-500/10" 
                : "border-white/5 bg-white/5 text-slate-500"
            )}
          >
            <Sparkles className={cn("w-5 h-5", activeTab === 'generator' ? "text-indigo-400" : "text-slate-500")} />
            <span className={cn("text-[9px] font-black uppercase tracking-tight", activeTab === 'generator' ? "text-white" : "text-slate-500")}>
              {t.generator}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('trends')}
            className={cn(
              "glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all duration-300",
              activeTab === 'trends' 
                ? "border-indigo-500/50 bg-indigo-600/20 shadow-lg shadow-indigo-500/10" 
                : "border-white/5 bg-white/5 text-slate-500"
            )}
          >
            <TrendingUp className={cn("w-5 h-5", activeTab === 'trends' ? "text-indigo-400" : "text-slate-500")} />
            <span className={cn("text-[9px] font-black uppercase tracking-tight", activeTab === 'trends' ? "text-white" : "text-slate-500")}>
              {t.trends}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('improve')}
            className={cn(
              "glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all duration-300",
              activeTab === 'improve' 
                ? "border-indigo-500/50 bg-indigo-600/20 shadow-lg shadow-indigo-500/10" 
                : "border-white/5 bg-white/5 text-slate-500"
            )}
          >
            <BarChart3 className={cn("w-5 h-5", activeTab === 'improve' ? "text-indigo-400" : "text-slate-500")} />
            <span className={cn("text-[9px] font-black uppercase tracking-tight", activeTab === 'improve' ? "text-white" : "text-slate-500")}>
              {t.audit}
            </span>
          </button>
        </div>

        {activeTab === 'generator' && (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Controls */}
            <div className="space-y-10">
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500">
                  {t.heroTitle}
                </h1>
                <p className="text-slate-400 text-lg">
                  {t.heroDesc}
                </p>
              </div>

              <section className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">01</div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{t.uploadLogo}</h2>
                  </div>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "relative group cursor-pointer border-2 border-dashed rounded-3xl p-10 transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden",
                      logo ? "border-indigo-500/50 bg-indigo-500/5" : "border-white/10 hover:border-indigo-500/30 bg-white/5 hover:bg-white/[0.07]"
                    )}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLogoUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    {logo ? (
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <img 
                          src={`data:${logo.mimeType};base64,${logo.base64}`} 
                          alt="Logo preview" 
                          className="max-w-full max-h-full object-contain drop-shadow-2xl"
                        />
                        <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full p-1.5 shadow-xl shadow-indigo-500/40">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-indigo-500/20">
                          <Upload className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-slate-200">{t.uploadLogo}</p>
                          <p className="text-xs text-slate-500 mt-1">{t.logoDesc}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">02</div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{t.referenceUrl}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="relative group">
                      <input 
                        type="url" 
                        value={referenceUrl}
                        onChange={(e) => setReferenceUrl(e.target.value)}
                        placeholder={t.referencePlaceholder}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 text-sm focus:border-indigo-500/50 focus:ring-0 transition-all duration-300 text-slate-200 placeholder:text-slate-600"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                        <LinkIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">03</div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{t.aspectRatio} & {t.selectCategory}</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">{t.aspectRatio}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ASPECT_RATIOS.map((ratio) => {
                          const Icon = ratio.icon;
                          return (
                            <button
                              key={ratio.id}
                              onClick={() => setSelectedRatio(ratio.id)}
                              className={cn(
                                "flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all duration-300",
                                selectedRatio === ratio.id
                                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                                  : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/10"
                              )}
                            >
                              <Icon className="w-5 h-5" />
                              <div className="text-center">
                                <p className="text-[10px] font-bold leading-tight">{ratio.name}</p>
                                <p className="text-[8px] opacity-60 font-medium">{ratio.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">{t.selectCategory}</p>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.id)}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border",
                                selectedCategory === cat.id
                                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                                  : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/10"
                              )}
                            >
                              <Icon className="w-3 h-3" />
                              {cat.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">04</div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{t.selectStyle}</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={cn(
                          "relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 group border",
                          selectedStyle === style.id 
                            ? "border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/10" 
                            : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-lg mb-3 shadow-inner", style.color)} />
                        <p className="font-bold text-sm text-slate-200">{style.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{style.description}</p>
                        {selectedStyle === style.id && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">05</div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{t.describePost}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative group">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t.describePlaceholder}
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 focus:border-indigo-500/50 focus:ring-0 transition-all duration-300 resize-none text-sm leading-relaxed text-slate-200 placeholder:text-slate-600"
                      />
                      <div className="absolute bottom-6 right-6 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                        <Type className="w-4 h-4" />
                      </div>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt}
                      className={cn(
                        "w-full h-16 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all duration-500 shadow-xl",
                        isGenerating || !prompt
                          ? "bg-white/5 text-slate-600 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20 active:scale-[0.98]"
                      )}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>{t.generating}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          <span>{t.generate}</span>
                        </>
                      )}
                    </button>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-rose-400 text-xs font-medium bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Preview */}
            <div className="relative">
              <div className="sticky top-28 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Live Preview</h2>
                    <p className="text-[10px] text-slate-500">See your brand come to life</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      disabled={!generatedImage}
                      onClick={shareImage}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-50 transition-all flex items-center gap-2"
                      title={t.share}
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase hidden sm:inline">{t.share}</span>
                    </button>
                    <button 
                      disabled={!generatedImage}
                      onClick={downloadImage}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-50 transition-all"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className={cn(
                  "glass-dark rounded-[3rem] shadow-2xl shadow-black/50 border border-white/5 overflow-hidden relative group transition-all duration-700",
                  selectedRatio === '1:1' && "aspect-square",
                  selectedRatio === '4:5' && "aspect-[4/5]",
                  selectedRatio === '9:16' && "aspect-[9/16] max-h-[750px] mx-auto",
                  selectedRatio === '16:9' && "aspect-[16/9]"
                )}>
                  {/* Decorative Social Photos in background when empty */}
                  {!generatedImage && !isGenerating && (
                    <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8 opacity-10 grayscale pointer-events-none">
                      <img src="https://picsum.photos/seed/fashion/400/600" alt="" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                      <img src="https://picsum.photos/seed/food/400/600" alt="" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                      <img src="https://picsum.photos/seed/travel/400/600" alt="" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                      <img src="https://picsum.photos/seed/tech/400/600" alt="" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {generatedImage ? (
                      <motion.div
                        key="generated"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full h-full"
                      >
                        <img 
                          src={generatedImage} 
                          alt="Generated brand post" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col items-center justify-center p-12 text-center relative z-10"
                      >
                        {isGenerating ? (
                          <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                              <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-bold uppercase tracking-widest text-white">Crafting your brand story</p>
                              <p className="text-xs text-slate-500">Our AI is mixing pixels and aesthetics...</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center mx-auto border border-indigo-500/20">
                              <ImageIcon className="w-10 h-10 text-indigo-400" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-bold text-white">Ready to Design</h3>
                              <p className="text-sm text-slate-500 max-w-[240px] mx-auto">
                                Your professional brand post will appear here once you hit generate.
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Instagram Mockup Decor */}
                <div className="glass p-6 rounded-[2rem] border border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-blue-500 p-[2px]">
                      <div className="w-full h-full rounded-full bg-slate-900 p-[1px]">
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                          {logo ? (
                            <img src={`data:${logo.mimeType};base64,${logo.base64}`} alt="Profile" className="w-full h-full object-contain" />
                          ) : (
                            <Instagram className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-28 bg-white/10 rounded-full mb-2" />
                      <div className="h-2 w-20 bg-white/5 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-white/5 rounded-full" />
                    <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500">
                  {t.trendsTitle}
                </h1>
                <p className="text-slate-400 text-lg">
                  {t.trendsDesc}
                </p>
              </div>
              
              <form onSubmit={handleSearchTrends} className="relative mt-8 group">
                <input
                  type="text"
                  value={trendQuery}
                  onChange={(e) => setTrendQuery(e.target.value)}
                  placeholder={t.trendsPlaceholder}
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-28 text-sm focus:border-indigo-500/50 focus:ring-0 transition-all shadow-2xl shadow-black/20 text-slate-200 placeholder:text-slate-600"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <button 
                  type="submit"
                  disabled={isSearchingTrends || !trendQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-5 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 disabled:opacity-50 transition-all"
                >
                  {isSearchingTrends ? <Loader2 className="w-4 h-4 animate-spin" /> : t.trendsSearch}
                </button>
              </form>
            </div>

            {/* Music Ranking Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Trending Audio</h2>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Top 10 Social Hits</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoadingMusic ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 glass rounded-3xl animate-pulse" />
                  ))
                ) : (
                  musicTrends.map((music) => (
                    <motion.div
                      key={music.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: music.rank * 0.05 }}
                      className="glass p-4 rounded-3xl border border-white/5 flex items-center gap-4 group hover:border-pink-500/30 transition-all"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={music.coverUrl} 
                          alt={music.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Music className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <div className="absolute top-1 left-1 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center text-[10px] font-black text-white border border-white/10">
                          {music.rank}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{music.title}</h4>
                        <p className="text-xs text-slate-400 truncate">{music.artist}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {music.isCopyrightFree ? (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-tighter">
                            <ShieldCheck className="w-3 h-3" />
                            No Copyright
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold uppercase tracking-tighter">
                            <ShieldAlert className="w-3 h-3" />
                            Copyrighted
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-slate-500">{music.usageCount} posts</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Visual Trends</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Latest Viral Aesthetics</p>
                </div>
              </div>

              {trends.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {trends.map((trend, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-500"
                    >
                      <div className="aspect-[4/5] overflow-hidden relative">
                        {/* Clickable Search Area */}
                        <a 
                          href={
                            trend.platform.toLowerCase().includes('instagram') ? `https://www.instagram.com/explore/tags/${trend.title.replace(/\s+/g, '')}/` :
                            trend.platform.toLowerCase().includes('pinterest') ? `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(trend.title)}` :
                            trend.platform.toLowerCase().includes('tiktok') ? `https://www.tiktok.com/search?q=${encodeURIComponent(trend.title)}` :
                            trend.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 z-10"
                        />
                        
                        <img 
                          src={trend.imageUrl} 
                          alt={trend.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                        
                        {/* Platform Link Button (Specific Source) */}
                        <a 
                          href={trend.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 z-20"
                          title={`View specific source on ${trend.platform}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
                          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">{trend.platform}</p>
                          <h3 className="text-lg font-bold text-white leading-tight">{trend.title}</h3>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {trend.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            setPrompt(`Inspired by ${trend.title}: ${trend.tags.join(', ')}`);
                            setActiveTab('generator');
                          }}
                          className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-xs font-bold hover:bg-white/10 transition-all"
                        >
                          {t.trendsUseInspiration}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : !isSearchingTrends && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-20 grayscale">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="aspect-[3/4] rounded-3xl bg-white/5 animate-pulse" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'improve' && (
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500">
                  {t.auditTitle}
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  {t.auditDesc}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Upload & Goals */}
              <div className="space-y-10">
                <section className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">01</div>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{t.auditUpload}</h2>
                    </div>
                    
                    <div 
                      onClick={() => improveFileInputRef.current?.click()}
                      className={cn(
                        "relative group cursor-pointer border-2 border-dashed rounded-3xl p-6 sm:p-10 transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden",
                        improveFile ? "border-indigo-500/50 bg-indigo-500/5" : "border-white/10 hover:border-indigo-500/30 bg-white/5 hover:bg-white/[0.07]"
                      )}
                    >
                      <input 
                        type="file" 
                        ref={improveFileInputRef} 
                        onChange={handleImproveFileUpload} 
                        accept="image/*,video/*" 
                        className="hidden" 
                      />
                      
                      {improveFile ? (
                        <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden rounded-2xl">
                          {improveFile.mimeType.startsWith('video') ? (
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                              </div>
                              <span className="text-sm font-bold text-slate-200">Video uploaded</span>
                            </div>
                          ) : (
                            <img 
                              src={`data:${improveFile.mimeType};base64,${improveFile.base64}`} 
                              alt="To improve" 
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute top-4 right-4 bg-indigo-500 text-white rounded-full p-2 shadow-xl shadow-indigo-500/40">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10">
                            <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-200">{t.auditUploadDesc}</p>
                            <p className="text-xs text-slate-500 mt-1">{t.auditUploadSub}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">02</div>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{t.auditPlatform} & {t.auditObjectives}</h2>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">{t.auditPlatform}</p>
                        <div className="flex flex-wrap gap-2">
                          {['Instagram', 'TikTok', 'LinkedIn', 'Pinterest', 'Twitter'].map((p) => (
                            <button
                              key={p}
                              onClick={() => setImprovePlatform(p)}
                              className={cn(
                                "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border",
                                improvePlatform === p
                                  ? "bg-white text-slate-950 border-white shadow-xl"
                                  : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/10"
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">{t.auditObjectives}</p>
                        <textarea
                          value={improveGoals}
                          onChange={(e) => setImproveGoals(e.target.value)}
                          placeholder={t.auditObjectivesPlaceholder}
                          className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 focus:border-indigo-500/50 focus:ring-0 transition-all resize-none text-sm text-slate-200 placeholder:text-slate-600"
                        />
                      </div>

                      <button
                        onClick={handleImprovePost}
                        disabled={isImproving || !improveFile || !improveGoals}
                        className={cn(
                          "w-full h-16 rounded-3xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all",
                          isImproving || !improveFile || !improveGoals
                            ? "bg-white/5 text-slate-600 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
                        )}
                      >
                        {isImproving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{t.auditAnalyzing}</span>
                          </>
                        ) : (
                          <>
                            <BarChart3 className="w-5 h-5" />
                            <span>{t.auditAnalyze}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right: AI Feedback */}
              <div className="glass rounded-[3rem] border border-white/5 overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <Target className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Social Media Marketer AI</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Senior Strategist</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8">
                  {!improveFeedback && !isImproving && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                      <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10">
                        <MessageSquare className="w-10 h-10 text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-200">{t.auditWaiting}</p>
                        <p className="text-xs text-slate-500 max-w-[200px]">{t.auditWaitingDesc}</p>
                      </div>
                    </div>
                  )}

                  {isImproving && (
                    <div className="space-y-6">
                      <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-full w-1/2 animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse" />
                      <div className="h-32 bg-white/5 rounded-[2.5rem] animate-pulse" />
                    </div>
                  )}

                  <div className="space-y-8">
                    {improveChatHistory.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex flex-col space-y-2",
                          msg.role === 'user' ? "items-end" : "items-start"
                        )}
                      >
                        <div className={cn(
                          "max-w-[85%] p-6 rounded-[2rem] text-sm leading-relaxed",
                          msg.role === 'user' 
                            ? "bg-indigo-600 text-white rounded-tr-none" 
                            : "bg-indigo-500/5 border border-indigo-500/10 text-slate-300 rounded-tl-none"
                        )}>
                          <div className="markdown-body">
                            <Markdown>{msg.text}</Markdown>
                          </div>
                        </div>
                        {msg.role === 'model' && idx === 0 && (
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-5 h-5 text-indigo-400" />
                            </div>
                            <p className="text-xs italic text-slate-400">
                              "{t.auditExpertQuote}"
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {isChatting && (
                      <div className="flex flex-col items-start space-y-2">
                        <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-[2rem] rounded-tl-none">
                          <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {improveFeedback && (
                  <form onSubmit={handleImproveChat} className="p-6 bg-white/5 border-t border-white/5">
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={improveChatInput}
                        onChange={(e) => setImproveChatInput(e.target.value)}
                        placeholder={t.auditChatPlaceholder}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm focus:border-indigo-500/50 focus:ring-0 transition-all text-slate-200 placeholder:text-slate-600"
                      />
                      <button 
                        type="submit"
                        disabled={isChatting || !improveChatInput.trim()}
                        className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 font-medium">© 2026 CraftUrPost. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
