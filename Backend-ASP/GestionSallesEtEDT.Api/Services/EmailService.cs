using System.Net;
using System.Net.Mail;

namespace GestionSallesEtEDT.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            var host = _config["Smtp:Host"]
                ?? throw new InvalidOperationException("Smtp:Host non configuré");
            var port = int.Parse(_config["Smtp:Port"] ?? "587");
            var user = _config["Smtp:User"]
                ?? throw new InvalidOperationException("Smtp:User non configuré");
            var password = _config["Smtp:Password"]
                ?? throw new InvalidOperationException("Smtp:Password non configuré");
            var fromEmail = _config["Smtp:From"] ?? user;
            var fromName = _config["Smtp:FromName"] ?? "EMIT";

            try
            {
                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(user, password),
                    EnableSsl = true,
                    Timeout = 10000 // 10 secondes
                };

                var message = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                };
                message.To.Add(to);

                await client.SendMailAsync(message);
                _logger.LogInformation("Email envoyé à {Email}", to);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur envoi email à {Email}", to);
                throw;
            }
        }
    }
}