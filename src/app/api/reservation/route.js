import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, date, time, guests } = await request.json();

    // Utilisation de Web3Forms pour éviter les blocages SMTP d'Apple sur Vercel
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        subject: `Nouvelle réservation : ${name} le ${date} à ${time}`,
        from_name: "La Team C - Site Web",
        Nom: name,
        Email_Client: email,
        Date: date,
        Heure: time,
        Couverts: guests,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Erreur Web3Forms");
    }

    return NextResponse.json({ message: "Réservation envoyée avec succès" }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json({ message: "Erreur lors de l'envoi", error: error.message }, { status: 500 });
  }
}
