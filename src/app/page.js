"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Utensils, Phone, Mail, Menu, X, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { scrollYProgress, scrollY } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yHeroText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHeroText = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = {
      date: e.target.date.value,
      time: e.target.time.value,
      guests: e.target.guests.value,
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
    };

    const promise = async () => {
      // Get the access key directly from the code (publicly safe)
      const key = "8be25e75-fe2e-4a5a-9de4-f3b35140b993";

      if (!key) throw new Error("Clé d'accès manquante");

      // Post directly from the browser to bypass Vercel server blocks
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: key,
          subject: `Nouvelle réservation : ${formData.name} le ${formData.date} à ${formData.time}`,
          from_name: "La Team C - Site Web",
          Nom: formData.name,
          Email_Client: formData.email,
          Telephone: formData.phone,
          Date: formData.date,
          Heure: formData.time,
          Couverts: formData.guests,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Erreur réseau");
      }
      return data;
    };

    toast.promise(promise(), {
      loading: 'Envoi de votre réservation...',
      success: () => {
        e.target.reset();
        setIsSubmitting(false);
        return 'Réservation confirmée ! Vous allez recevoir un email.';
      },
      error: (err) => {
        setIsSubmitting(false);
        return 'Erreur : ' + err.message;
      },
    });
  };

  const navLinks = [
    { name: "Le Concept", href: "#concept" },
    { name: "La Carte", href: "#menu" },
    { name: "Événements", href: "#events" },
  ];

  return (
    <main className="min-h-screen">
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-[#FDFBF7]/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className={`font-playfair text-2xl font-bold transition-colors ${isScrolled ? "text-[#113622]" : "text-white"}`}>
            La Team C
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide relative group ${isScrolled ? "text-gray-800" : "text-gray-200"}`}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#c69c38] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <a
              href="#reservation"
              className={`px-6 py-2.5 rounded-full border text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                isScrolled
                  ? "border-[#113622] text-[#113622] hover:bg-[#113622] hover:text-[#FDFBF7]"
                  : "border-white/50 text-white hover:bg-white hover:text-[#113622]"
              }`}
            >
              Réserver
            </a>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            className={`md:hidden ${isScrolled ? "text-[#113622]" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-[#FDFBF7] shadow-xl flex flex-col py-6 px-6 gap-4 md:hidden border-t border-gray-100"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-[#113622] font-medium"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#reservation"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-6 py-3 bg-[#c69c38] text-white rounded-full text-center font-medium"
              >
                Réserver une table
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO SECTION */}
      <section id="hero" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <Image
            src="/assets/hero_cafe_cantine_1791307689973.jpg"
            alt="La Team C Restaurant"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2515]/60 via-[#0a2515]/50 to-[#0a2515]/80"></div>
        
        <motion.div 
          style={{ y: yHeroText, opacity: opacityHeroText }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#c69c38] uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-6"
          >
            Cocktail • Café • Cantine
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white text-5xl md:text-7xl lg:text-8xl font-playfair leading-[1.1] mb-6"
          >
            Un lieu de vie <br />
            <span className="italic text-[#c69c38] font-normal">gourmand et convivial</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/90 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto"
          >
            Cuisine du jour et créations originales à Marseillan. Ouvert du lundi au samedi.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a href="#reservation" className="px-8 py-4 bg-[#c69c38] text-white rounded-full font-medium hover:bg-[#d4af37] hover:scale-105 transition-all shadow-[0_10px_30px_rgba(198,156,56,0.3)] w-full sm:w-auto">
              Réserver une table
            </a>
            <a href="#menu" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-medium hover:bg-white hover:text-[#113622] transition-all w-full sm:w-auto">
              Découvrir le menu
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#113622] text-[#c69c38] py-3 overflow-hidden flex whitespace-nowrap border-y border-[#c69c38]/20">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ ease: "linear", duration: 15, repeat: Infinity }}
          className="flex font-playfair italic text-lg md:text-xl tracking-wider"
        >
          <span className="mx-4">COCKTAIL • CAFÉ • CANTINE • TAPAS • ESCAPE GAME CULINAIRE • ÉVÉNEMENTS • </span>
          <span className="mx-4">COCKTAIL • CAFÉ • CANTINE • TAPAS • ESCAPE GAME CULINAIRE • ÉVÉNEMENTS • </span>
          <span className="mx-4">COCKTAIL • CAFÉ • CANTINE • TAPAS • ESCAPE GAME CULINAIRE • ÉVÉNEMENTS • </span>
        </motion.div>
      </div>

      {/* CONCEPT SECTION */}
      <section id="concept" className="py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl text-[#113622] font-playfair mb-6 leading-tight">
              Notre Histoire, <br/>Votre Expérience
            </h2>
            <div className="w-16 h-1 bg-[#c69c38] mb-8"></div>
            <div className="text-gray-600 space-y-4 text-lg">
              <p>
                À La Team C, nous avons repensé la restauration pour vous offrir un véritable lieu de vie. Que vous veniez pour un café matinal, un déjeuner sur le pouce, ou une soirée cocktails entre amis, notre équipe vous accueille avec passion.
              </p>
              <p>
                Des produits frais, une ambiance chaleureuse et végétale, et une carte qui évolue avec les saisons. Venez comme vous êtes, on s'occupe du reste.
              </p>
            </div>
            
            <ul className="mt-10 space-y-4">
              {[
                { icon: Clock, text: "09h00 - 23h00 Lundi au Samedi" },
                { icon: MapPin, text: "17B Bd Lamartine, Marseillan" },
                { icon: Utensils, text: "Sur place ou à emporter" },
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#c69c38]/10 text-[#c69c38] rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon size={24} />
                  </div>
                  <span className="font-medium text-gray-800">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <div className="relative h-[500px] md:h-[600px] mt-10 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              animate={{ y: [0, -15, 0] }}
              className="absolute top-0 right-0 w-[75%] h-[80%] rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <Image src="/assets/food_toast_1791307712491.jpg" alt="Toast Gourmet" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              animate={{ y: [0, 15, 0] }}
              className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-2xl overflow-hidden shadow-2xl border-8 border-[#FDFBF7] z-20"
            >
              <Image src="/assets/cocktail_drink_1791307701327.jpg" alt="Cocktail" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-[#113622] font-playfair mb-4">Quelques Merveilles</h2>
            <p className="text-gray-500 text-lg">Aperçu de notre carte, faite maison avec amour.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Le Toast de la Team", price: "14€", desc: "Pain au levain toasté, avocat écrasé, œuf au plat parfait, légumes de saison.", img: "/assets/food_toast_1791307712491.jpg" },
              { title: "Tartare de Thon Frais", price: "18€", desc: "Thon rouge, citron vert, huile de sésame, coriandre fraîche, accompagné de frites maison.", img: null },
              { title: 'Cocktail "Le Marseillan"', price: "11€", desc: "Gin infusé au romarin, sirop de concombre, citron vert, et touche d'or comestible.", img: "/assets/cocktail_drink_1791307701327.jpg" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group bg-[#FDFBF7] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`relative h-64 overflow-hidden ${!item.img && 'bg-gradient-to-br from-[#113622] to-[#1a5133]'}`}>
                  {item.img && (
                    <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#113622] font-playfair font-bold text-xl px-4 py-2 rounded-full shadow-lg">
                    {item.price}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#113622] mb-3 font-playfair">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <a href="#menu" onClick={(e) => { e.preventDefault(); toast("La carte complète arrive bientôt !", { description: "Nous préparons un beau PDF avec tous nos plats."}); }} className="inline-flex items-center gap-2 text-[#113622] border-b-2 border-[#c69c38] pb-1 font-medium hover:text-[#c69c38] transition-colors group cursor-pointer">
              Voir la carte complète
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="py-24 bg-[#113622] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c69c38] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-playfair mb-6">Événements & Animations</h2>
            <p className="text-gray-300 text-lg mb-10">La Team C n'est pas qu'un restaurant, c'est un véritable lieu de vie. Découvrez nos événements uniques pour rythmer vos semaines.</p>
            
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors backdrop-blur-sm">
                <h3 className="text-2xl font-playfair text-[#c69c38] mb-2 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#c69c38] animate-pulse"></span>
                  Escape Game Culinaire
                </h3>
                <p className="text-sm text-gray-300 mb-2">Tous les jeudis à 12h ou 19h.</p>
                <p className="text-gray-400 text-sm">50€ : Entrée + Plat + Dessert + 2 verres de vin. Devinez les produits utilisés par le chef et gagnez des points. Un digestif maison OFFERT !</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors backdrop-blur-sm">
                <h3 className="text-2xl font-playfair text-[#c69c38] mb-2">La Team C fait son Oktoberfest</h3>
                <p className="text-gray-400 text-sm">Des bières spéciales, des plats d'inspiration bavaroise et une ambiance festive pour célébrer ensemble.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border border-dashed border-[#c69c38]/50 p-6 animate-[spin_20s_linear_infinite]">
              <div className="w-full h-full rounded-full overflow-hidden relative animate-[spin_20s_linear_infinite_reverse]">
                <Image src="/assets/food_toast_1791307712491.jpg" alt="Event" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-[#113622]/60 flex flex-col items-center justify-center text-center p-6">
                  <h3 className="text-3xl font-playfair font-bold text-white mb-2">ESCAPE GAME</h3>
                  <p className="text-[#c69c38] italic font-playfair text-xl">Culinaire</p>
                </div>
              </div>
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 right-10 bg-[#c69c38] text-[#113622] font-bold py-2 px-4 rounded-full text-sm transform rotate-12 shadow-xl"
            >
              Tous les jeudis !
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* RESERVATION SECTION */}
      <section id="reservation" className="py-24 bg-[#FDFBF7] relative">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col justify-center"
          >
            <h2 className="text-4xl md:text-5xl text-[#113622] font-playfair mb-6">Réserver une table</h2>
            <p className="text-gray-600 mb-10">
              Assurez-vous d'avoir une place en réservant en ligne. Ce module de réservation est propulsé de manière fluide. 
              <br/><br/>
              <span className="text-xs text-[#c69c38] font-semibold tracking-wider uppercase border border-[#c69c38] px-2 py-1 rounded">Intégration L'Addition possible</span>
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#113622]/5 flex items-center justify-center text-[#113622]">
                  <Phone size={20} />
                </div>
                <span className="font-medium">+33 4 00 00 00 00</span>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#113622]/5 flex items-center justify-center text-[#113622]">
                  <Mail size={20} />
                </div>
                <span className="font-medium">contact@lateamc.fr</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(17,54,34,0.08)] border border-gray-100">
              <form onSubmit={handleReservation} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <input name="date" type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#c69c38] focus:ring-1 focus:ring-[#c69c38] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Heure</label>
                    <select name="time" required defaultValue="" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#c69c38] focus:ring-1 focus:ring-[#c69c38] transition-all appearance-none">
                      <option value="" disabled>Choisir une heure</option>
                      <option value="12:00">12:00</option>
                      <option value="12:30">12:30</option>
                      <option value="19:00">19:00</option>
                      <option value="19:30">19:30</option>
                      <option value="20:00">20:00</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Couverts</label>
                    <select name="guests" required defaultValue="2" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#c69c38] focus:ring-1 focus:ring-[#c69c38] transition-all appearance-none">
                      <option value="1">1 Personne</option>
                      <option value="2">2 Personnes</option>
                      <option value="3">3 Personnes</option>
                      <option value="4">4 Personnes</option>
                      <option value="5">5 Personnes</option>
                      <option value="6">6 Personnes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nom</label>
                    <input name="name" type="text" placeholder="Votre nom" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#c69c38] focus:ring-1 focus:ring-[#c69c38] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input name="email" type="email" placeholder="votre@email.com" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#c69c38] focus:ring-1 focus:ring-[#c69c38] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Téléphone</label>
                    <input name="phone" type="tel" placeholder="06 00 00 00 00" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#c69c38] focus:ring-1 focus:ring-[#c69c38] transition-all" />
                  </div>
                </div>
                <button disabled={isSubmitting} type="submit" className="w-full bg-[#113622] text-white rounded-xl py-4 font-medium text-lg hover:bg-[#1a5133] transition-all relative overflow-hidden group disabled:opacity-80 disabled:cursor-not-allowed">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Traitement...
                      </>
                    ) : (
                      "Confirmer la réservation"
                    )}
                  </span>
                  {!isSubmitting && <div className="absolute inset-0 h-full w-0 bg-[#c69c38] transition-all duration-500 ease-out group-hover:w-full z-0"></div>}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#08150c] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
          <div>
            <h3 className="text-3xl font-playfair text-[#c69c38] mb-4">La Team C</h3>
            <p className="text-gray-400">Cocktail • Café • Cantine</p>
            <p className="text-gray-500 text-sm mt-4">Un lieu de vie au cœur de Marseillan.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold mb-2">Navigation</h4>
            <a href="#hero" className="text-gray-400 hover:text-[#c69c38] transition-colors w-fit">Accueil</a>
            <a href="#concept" className="text-gray-400 hover:text-[#c69c38] transition-colors w-fit">Le Concept</a>
            <a href="#menu" className="text-gray-400 hover:text-[#c69c38] transition-colors w-fit">La Carte</a>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <a href="https://instagram.com/lateamc_marseillan" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-gray-300 hover:bg-[#c69c38] hover:border-[#c69c38] hover:text-[#113622] transition-all group">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 text-center text-gray-600 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2026 La Team C Marseillan. Tous droits réservés.</p>
          <p className="mt-2 md:mt-0">Design Premium par Antigravity</p>
        </div>
      </footer>
    </main>
  );
}
