import nodemailer from "nodemailer";

export default function nodemailerAdapter(options) {
  return {
    async sendVerificationRequest({ identifier: email, url, baseUrl, provider }) {
      const { server, from } = options;

      const site = baseUrl || provider.site;
      const { name, email: siteEmail } = from;
      const { user, pass } = server.auth;

      const transport = nodemailer.createTransport({
        host: server.host,
        port: server.port,
        secure: server.secure,
        auth: { user, pass },
      });

      const message = {
        to: email,
        from: `${name} <${siteEmail}>`,
        subject: `Sign in to ${site}`,
        html: `
          <h1>Sign in to ${site}</h1>
          <p>Please click the button below to sign in:</p>
          <p><a href="${url}" target="_blank" rel="noopener">Sign in</a></p>
        `,
      };

      await transport.sendMail(message);
    },
  };
}
