import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

/**
 * helper function to send a registration email with a confirmation link.
 * @param {datos} datos - Data for the registration email.
 */
const emailReg = async (datos) => {
  const { email, name, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.HOST_NODEMAILER,
    port: process.env.PORT_NODEMAILER,
    auth: {
      user: process.env.USER_NODEMAILER,
      pass: process.env.PASS_NODEMAILER,
    },
  });

  const info = await transport.sendMail({
    from: '"LigaWhyNot - Admin" <admin@whynot.com>', // Sender's information
    to: email, // Recipient's email
    subject: "LigaWhyNot - Confirma tu cuenta", // Email subject
    text: "Confirma tu cuenta en la liga WhyNot", // Plain text version of the email
    html: `<p>Hola ${name} Confirma tu cuenta en la liga WhyNot!</p>
        <p>Tu cuenta aún no esta lista, confirma clickeando el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}confirmar/${token}">Confirmar cuenta</a> </p>
        <p>Si no solicitaste esto, puedes ignorar este mensaje</p>
        `,
  });
};

/**
 * helper function to send a password reset email with a link to reset your password.
 * @param {datos} datos - Data for the password reset email.
 */
const emailPwd = async (datos) => {
  const { email, name, token } = datos;

  // Create a transport configuration for sending the password restoration email
  const transport = nodemailer.createTransport({
    host: process.env.HOST_NODEMAILER,
    port: process.env.PORT_NODEMAILER,
    auth: {
      user: process.env.USER_NODEMAILER,
      pass: process.env.PASS_NODEMAILER,
    },
  });

  // Compose and send the password restoration email
  const info = await transport.sendMail({
    from: '"LigaWhyNot - Admin" <admin@whynot.com>',
    to: email,
    subject: "LigaWhyNot - Restaura tu contraseña",
    text: "Restaura tu cuenta en la LigaWhyNot",
    html: `<p>Hola: ${name} restaura tu cuenta en la LigaWhyNot</p>
          <p>Dale click al enlace de abajo para restaurar tu cuenta:
          <a href="${process.env.FRONTEND_URL}olvidepassword/${token}">Restaurar</a> </p>
          <p>Si no solicitaste restaurar tu contraseña puedes ingnorar este correo</p>
          `,
  });
};

export { emailReg, emailPwd };
