import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, date, time, guests } = await request.json();

    // Configuration de Nodemailer avec les paramètres iCloud
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.me.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'achraf.boulali@icloud.com',
        // Il faut générer un mot de passe d'application spécifique dans votre compte Apple
        pass: process.env.EMAIL_APP_PASSWORD, 
      },
    });

    // Options de l'email
    const mailOptions = {
      from: '"La Team C - Site Web" <achraf.boulali@icloud.com>', // L'adresse d'envoi (doit être l'adresse iCloud)
      to: 'achraf.boulali@icloud.com', // L'adresse de réception
      subject: `Nouvelle réservation : ${name} le ${date} à ${time}`,
      html: `
        <h2>Nouvelle demande de réservation</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Date :</strong> ${date}</p>
        <p><strong>Heure :</strong> ${time}</p>
        <p><strong>Nombre de couverts :</strong> ${guests}</p>
      `,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Réservation envoyée avec succès" }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json({ message: "Erreur lors de l'envoi", error: error.message }, { status: 500 });
  }
}
